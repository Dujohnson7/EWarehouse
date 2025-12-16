using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EWarehouse.Configuration;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApiContext _context;
        private readonly IEmailService _emailService;
        private readonly IOtpService _otpService;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            ApiContext context,
            IEmailService emailService,
            IOtpService otpService,
            IOptions<JwtSettings> jwtSettings,
            ILogger<AuthService> logger)
        {
            _context = context;
            _emailService = emailService;
            _otpService = otpService;
            _jwtSettings = jwtSettings.Value;
            _logger = logger;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => 
                        u.Email == request.Email && 
                        u.Password == request.Password &&
                        u.IsActive);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed for email: {request.Email}");
                    return null;
                }

                var token = GenerateJwtToken(user);

                return new LoginResponseDto
                {
                    UserID = user.UserID,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token,
                    WarehouseID = user.WarehouseID,
                    isInsert = user.isInsert,
                    isUpdate = user.isUpdate,
                    isDelete = user.isDelete,
                    IsActive = user.IsActive
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error during login: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> SendOtpAsync(string email)
        {
            try
            {
                // Check if user exists
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
                if (user == null)
                {
                    _logger.LogWarning($"User not found for email: {email}");
                    return false;
                }

                var otp = _otpService.GenerateOtp();
                _otpService.StoreOtp(email, otp);

                var emailSent = await _emailService.SendOtpEmailAsync(email, otp);
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error sending OTP: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> VerifyOtpAsync(string email, string otpCode)
        {
            try
            {
                var isValid = _otpService.ValidateOtp(email, otpCode);
                if (isValid)
                {
                    _otpService.RemoveOtp(email);
                }
                return isValid;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error verifying OTP: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
                if (user == null)
                {
                    _logger.LogWarning($"User not found for email: {email}");
                    return false;
                }

                var otp = _otpService.GenerateOtp();
                _otpService.StoreOtp(email, otp);

                var emailSent = await _emailService.SendPasswordResetEmailAsync(email, otp);
                return emailSent;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error in forgot password: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            try
            {
                var isValidOtp = _otpService.ValidateOtp(request.Email, request.OtpCode);
                if (!isValidOtp)
                {
                    _logger.LogWarning($"Invalid OTP for password reset: {request.Email}");
                    return false;
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);
                if (user == null)
                {
                    _logger.LogWarning($"User not found for email: {request.Email}");
                    return false;
                }

                // Update password directly (in real app, you should hash the password)
                user.Password = request.NewPassword;
                await _context.SaveChangesAsync();

                // Remove OTP
                _otpService.RemoveOtp(request.Email);

                _logger.LogInformation($"Password reset successful for: {request.Email}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error resetting password: {ex.Message}");
                return false;
            }
        }

        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            if (user.WarehouseID.HasValue)
            {
                claims.Add(new Claim("WarehouseID", user.WarehouseID.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
