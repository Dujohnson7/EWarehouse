using System.Collections.Concurrent;

namespace EWarehouse.Services
{
    public class OtpService : IOtpService
    {
        private readonly ConcurrentDictionary<string, OtpData> _otpStore = new();
        private readonly ILogger<OtpService> _logger;

        public OtpService(ILogger<OtpService> logger)
        {
            _logger = logger;
        }

        public string GenerateOtp()
        {
            var random = new Random();
            var otp = random.Next(100000, 999999).ToString();
            return otp;
        }

        public void StoreOtp(string email, string otp)
        {
            var otpData = new OtpData
            {
                Code = otp,
                ExpiryTime = DateTime.Now.AddMinutes(5) // OTP expires in 5 minutes
            };

            _otpStore.AddOrUpdate(email.ToLower(), otpData, (key, oldValue) => otpData);
            _logger.LogInformation($"OTP stored for {email}, expires at {otpData.ExpiryTime}");
        }

        public bool ValidateOtp(string email, string otp)
        {
            var emailKey = email.ToLower();

            if (_otpStore.TryGetValue(emailKey, out var otpData))
            {
                if (DateTime.Now > otpData.ExpiryTime)
                {
                    _logger.LogWarning($"OTP expired for {email}");
                    _otpStore.TryRemove(emailKey, out _);
                    return false;
                }

                if (otpData.Code == otp)
                {
                    _logger.LogInformation($"OTP validated successfully for {email}");
                    return true;
                }

                _logger.LogWarning($"Invalid OTP provided for {email}");
                return false;
            }

            _logger.LogWarning($"No OTP found for {email}");
            return false;
        }

        public void RemoveOtp(string email)
        {
            var emailKey = email.ToLower();
            _otpStore.TryRemove(emailKey, out _);
            _logger.LogInformation($"OTP removed for {email}");
        }

        private class OtpData
        {
            public string Code { get; set; } = string.Empty;
            public DateTime ExpiryTime { get; set; }
        }
    }
}
