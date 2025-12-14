# E-Warehouse Backend API

## Overview
This is a comprehensive E-Warehouse Management System backend built with ASP.NET Core 8.0 Web API, Entity Framework Core, and SQL Server. The system uses stored procedures for all database operations and includes email OTP functionality for authentication and password reset.

## Features

### Authentication & Security
- ✅ User login with email and password
- ✅ JWT token-based authentication
- ✅ Email OTP verification
- ✅ Password reset with OTP
- ✅ Audit logging for all operations

### Stock Management
- ✅ Stock IN operations
- ✅ Stock OUT operations
- ✅ Stock ADJUST operations
- ✅ Transfer OUT (between warehouses)
- ✅ Transfer IN (between warehouses)
- ✅ Real-time stock status tracking

### Entity Management
- ✅ Users (CRUD operations)
- ✅ Warehouses
- ✅ Zones
- ✅ Bins
- ✅ Categories
- ✅ Products
- ✅ Alerts
- ✅ Stock Movements
- ✅ Audit Logs

## Technologies Used

- **Framework**: ASP.NET Core 8.0
- **ORM**: Entity Framework Core 8.0
- **Database**: SQL Server (using stored procedures)
- **Authentication**: JWT Bearer Tokens
- **Email**: MailKit (SMTP)
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
EWarehouse/
├── Configuration/          # Configuration classes
│   ├── EmailSettings.cs
│   └── JwtSettings.cs
├── Controllers/           # API Controllers
│   ├── AuthController.cs
│   ├── UsersController.cs
│   └── StockMovementsController.cs
├── Data/                 # Database Context
│   └── ApiContext.cs
├── DTOs/                 # Data Transfer Objects
│   ├── UserDtos.cs
│   ├── StockMovementDtos.cs
│   ├── WarehouseDtos.cs
│   ├── ProductDtos.cs
│   └── CommonDtos.cs
├── Models/               # Entity Models
│   ├── User.cs
│   ├── Warehouse.cs
│   ├── Zone.cs
│   ├── Bin.cs
│   ├── Category.cs
│   ├── Product.cs
│   ├── ProductLocation.cs
│   ├── StockMovement.cs
│   ├── StockStatus.cs
│   ├── Alert.cs
│   └── AuditLog.cs
├── Services/             # Business Logic Services
│   ├── IEmailService.cs / EmailService.cs
│   ├── IOtpService.cs / OtpService.cs
│   ├── IAuthService.cs / AuthService.cs
│   ├── IStockMovementService.cs / StockMovementService.cs
│   └── IUserService.cs / UserService.cs
├── appsettings.json     # Configuration
└── Program.cs           # Application entry point
```

## Configuration

### Database Connection
Update the connection string in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EWarehouse_DB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### Email Settings
The email configuration is already set up with Gmail:
```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": 587,
  "SenderEmail": "dujohnson123@gmail.com",
  "SenderName": "E-Warehouse System",
  "AppPassword": "vtqp ayvn yoxn mgmm"
}
```

**Note**: Make sure the Gmail account has "App Passwords" enabled for this to work.

### JWT Settings
```json
"JwtSettings": {
  "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345!",
  "Issuer": "EWarehouseAPI",
  "Audience": "EWarehouseClient",
  "ExpiryMinutes": 60
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user (soft delete)

### Stock Movements
- `POST /api/stockmovements/in` - Stock IN
- `PUT /api/stockmovements/in/{id}` - Update Stock IN
- `DELETE /api/stockmovements/in/{id}` - Delete Stock IN
- `POST /api/stockmovements/out` - Stock OUT
- `PUT /api/stockmovements/out/{id}` - Update Stock OUT
- `DELETE /api/stockmovements/out/{id}` - Delete Stock OUT
- `POST /api/stockmovements/adjust` - Stock ADJUST
- `PUT /api/stockmovements/adjust/{id}` - Update Stock ADJUST
- `DELETE /api/stockmovements/adjust/{id}` - Delete Stock ADJUST
- `POST /api/stockmovements/transfer-out` - Transfer OUT
- `PUT /api/stockmovements/transfer-out/{id}` - Update Transfer OUT
- `DELETE /api/stockmovements/transfer-out/{id}` - Delete Transfer OUT
- `POST /api/stockmovements/transfer-in` - Transfer IN
- `PUT /api/stockmovements/transfer-in/{id}` - Update Transfer IN
- `DELETE /api/stockmovements/transfer-in/{id}` - Delete Transfer IN
- `GET /api/stockmovements` - Get all movements
- `GET /api/stockmovements/{id}` - Get movement by ID

## Running the Application

### Prerequisites
- .NET 8.0 SDK
- SQL Server (with EWarehouse_DB database)
- All stored procedures must be created in the database

### Steps
1. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

2. Update the connection string in `appsettings.json`

3. Run the application:
   ```bash
   dotnet run
   ```

4. Access Swagger UI:
   ```
   https://localhost:5001/swagger
   ```

## Testing the API

### 1. Test Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Test OTP Flow
```json
POST /api/auth/send-otp
{
  "email": "user@example.com"
}
```

Check your email for the OTP code, then:
```json
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

### 3. Test Password Reset
```json
POST /api/auth/forgot-password
{
  "email": "user@example.com"
}
```

Then reset with OTP:
```json
POST /api/auth/reset-password
{
  "email": "user@example.com",
  "otpCode": "123456",
  "newPassword": "newPassword123"
}
```

### 4. Test Stock IN
```json
POST /api/stockmovements/in
{
  "productID": 1,
  "warehouseID": 1,
  "toBinID": 1,
  "quantity": 100
}
```

## Important Notes

### Stored Procedures
This application uses stored procedures for all database operations. Make sure all the following stored procedures exist in your database:

**Users:**
- `usp_User_Login`
- `usp_Users_Insert`
- `usp_Users_Update`
- `usp_Users_Delete`

**Stock Movements:**
- `usp_StockMovements_Insert_IN`
- `usp_StockMovements_Update_IN`
- `usp_StockMovements_Delete_IN`
- `usp_StockMovements_Insert_OUT`
- `usp_StockMovements_Update_OUT`
- `usp_StockMovements_Delete_OUT`
- `usp_StockMovements_Insert_ADJUST`
- `usp_StockMovements_Update_ADJUST`
- `usp_StockMovements_Delete_ADJUST`
- `usp_StockMovements_Insert_Transfer_Out`
- `usp_StockMovements_Update_Transfer_Out`
- `usp_StockMovements_Delete_Transfer_Out`
- `usp_StockMovements_Insert_Transfer_In`
- `usp_StockMovements_Update_Transfer_In`
- `usp_StockMovements_Delete_Transfer_In`

### OTP Expiration
- OTP codes expire after **5 minutes**
- OTP codes are **6-digit numeric** codes
- OTP storage is **in-memory** (will be cleared on application restart)

### Password Security
**⚠️ IMPORTANT**: The current implementation stores passwords in plain text. For production use, you MUST implement password hashing using:
- BCrypt
- PBKDF2
- Argon2

### JWT Authentication
- Tokens expire after 60 minutes (configurable in appsettings.json)
- To use protected endpoints, include the JWT token in the Authorization header:
  ```
  Authorization: Bearer <your-token-here>
  ```

## Next Steps

To complete the implementation for all entities, follow the pattern established in `UsersController` and `UserService`:

1. Create service interface (e.g., `IWarehouseService.cs`)
2. Create service implementation (e.g., `WarehouseService.cs`)
3. Create controller (e.g., `WarehousesController.cs`)
4. Register service in `Program.cs`
5. Test endpoints in Swagger

## Troubleshooting

### Email not sending
- Verify Gmail credentials are correct
- Enable "App Passwords" in Gmail account settings
- Check firewall/antivirus isn't blocking SMTP port 587

### Database connection issues
- Verify SQL Server is running
- Check connection string is correct
- Ensure database `EWarehouse_DB` exists
- Verify all stored procedures are created

### JWT token issues
- Ensure SecretKey is at least 32 characters
- Check token hasn't expired
- Verify Authorization header format: `Bearer <token>`

## License
This project is for educational purposes.

## Support
For issues or questions, please contact the development team.
