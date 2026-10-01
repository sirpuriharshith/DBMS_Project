from datetime import date
from decimal import Decimal
from pydantic import BaseModel,EmailStr,Field
class RegisterIn(BaseModel):
    full_name:str=Field(min_length=2,max_length=120);email:EmailStr;password:str=Field(min_length=6,max_length=100);role:str="TENANT";phone:str|None=None
class LoginIn(BaseModel): email:EmailStr;password:str
class AdminSecondPasswordIn(BaseModel): challenge_token:str;second_password:str=Field(min_length=6,max_length=100)
class PropertyCreate(BaseModel):
    title:str;description:str;property_type:str;city:str;area:str;address:str|None=None;latitude:float|None=None;longitude:float|None=None;monthly_rent:Decimal;bedrooms:int; bathrooms:int;furnished:bool=False;image_url:str|None=None
class BookingCreate(BaseModel): property_id:int;start_date:date;end_date:date|None=None
class BookingStatus(BaseModel): status:str
class PaymentCreate(BaseModel): booking_id:int
class ChatIn(BaseModel): message:str
