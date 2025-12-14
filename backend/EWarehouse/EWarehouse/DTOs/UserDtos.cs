namespace EWarehouse.DTOs
{
    // Login DTOs
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public int UserID { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public int? WarehouseID { get; set; }
        public bool isInsert { get; set; }
        public bool isUpdate { get; set; }
        public bool isDelete { get; set; }
        public bool IsActive { get; set; }
    }

    // OTP DTOs
    public class SendOtpRequestDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
    }

    public class OtpResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    // Forgot Password DTOs
    public class ForgotPasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;
    }

    // Reset Password DTOs
    public class ResetPasswordRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    // User CRUD DTOs
    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? WarehouseID { get; set; }
    }

    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public string Role { get; set; } = string.Empty;
        public int? WarehouseID { get; set; }
        public bool isUpdate { get; set; }
        public bool isInsert { get; set; }
        public bool isDelete { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserDto
    {
        public int UserID { get; set; }
        public string? UserProfile { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? WarehouseID { get; set; }
        public bool isUpdate { get; set; }
        public bool isInsert { get; set; }
        public bool isDelete { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
