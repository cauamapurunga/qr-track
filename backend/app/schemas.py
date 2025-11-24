import re
from pydantic import BaseModel, field_validator, ValidationError
from pydantic_core import PydanticCustomError

class User(BaseModel):
    username: str
    email: str
    password: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, email):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            raise PydanticCustomError(
                'invalid_email',
                'Email format is invalid. Please provide a valid email address.'
            )
        return email

class UserLogin(BaseModel):
    username: str  # Pode ser username ou email
    password: str


# Schemas para QR Code
class QRCodeCreate(BaseModel):
    destination_url: str


class QRCodeResponse(BaseModel):
    id: int
    code: str
    destination_url: str
    created_at: str
    scan_count: int = 0
    
    class Config:
        from_attributes = True


# Schemas para Analytics
class ScanAnalytic(BaseModel):
    id: int
    ip_address: str
    browser: str | None
    browser_version: str | None
    os: str | None
    os_version: str | None
    device: str | None
    country: str | None
    city: str | None
    latitude: str | None
    longitude: str | None
    timezone: str | None
    isp: str | None
    scanned_at: str
    
    class Config:
        from_attributes = True


class BrowserStats(BaseModel):
    name: str
    count: int


class OSStats(BaseModel):
    name: str
    count: int


class DeviceStats(BaseModel):
    type: str
    count: int


class CityStats(BaseModel):
    name: str
    count: int


class CountryStats(BaseModel):
    name: str
    count: int
    top_cities: list[CityStats]


class AnalyticsResponse(BaseModel):
    qr_code: QRCodeResponse
    total_scans: int
    unique_visitors: int
    scans: list[ScanAnalytic]
    top_browsers: list[BrowserStats]
    top_os: list[OSStats]
    top_devices: list[DeviceStats]
    top_countries: list[CountryStats]