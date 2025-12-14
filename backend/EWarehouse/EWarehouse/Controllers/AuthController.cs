using Microsoft.AspNetCore.Mvc;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// User login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.LoginAsync(request);

            if (result == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(result);
        }

        /// <summary>
        /// Send OTP to user's email for verification
        /// </summary>
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.SendOtpAsync(request.Email);

            if (!result)
                return BadRequest(new { message = "Failed to send OTP. Please check the email address." });

            return Ok(new { message = "OTP sent successfully to your email" });
        }

        /// <summary>
        /// Verify OTP code
        /// </summary>
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.VerifyOtpAsync(request.Email, request.OtpCode);

            if (!result)
                return BadRequest(new { message = "Invalid or expired OTP" });

            return Ok(new { message = "OTP verified successfully" });
        }

        /// <summary>
        /// Request password reset - sends OTP to email
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ForgotPasswordAsync(request.Email);

            if (!result)
                return BadRequest(new { message = "Failed to send password reset email. Please check the email address." });

            return Ok(new { message = "Password reset OTP sent to your email" });
        }

        /// <summary>
        /// Reset password with OTP verification
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _authService.ResetPasswordAsync(request);

            if (!result)
                return BadRequest(new { message = "Failed to reset password. Please check your OTP and try again." });

            return Ok(new { message = "Password reset successfully. You can now login with your new password." });
        }
    }
}
