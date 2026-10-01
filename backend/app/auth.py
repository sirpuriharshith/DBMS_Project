import hashlib,secrets
from datetime import datetime,timedelta,timezone
import jwt
ALGORITHM="HS256"
def hash_password(password):
    salt=secrets.token_hex(16);iterations=120000
    digest=hashlib.pbkdf2_hmac("sha256",password.encode(),salt.encode(),iterations).hex()
    return f"pbkdf2${iterations}${salt}${digest}"
def verify_password(password,stored):
    try:
        kind,it,salt,expected=stored.split("$")
        if kind!="pbkdf2": return False
        actual=hashlib.pbkdf2_hmac("sha256",password.encode(),salt.encode(),int(it)).hex()
        return secrets.compare_digest(actual,expected)
    except (ValueError,TypeError): return False
def create_token(user_id,role,secret,minutes=720,purpose=None):
    now=datetime.now(timezone.utc)
    payload={"sub":str(user_id),"role":role,"iat":now,"exp":now+timedelta(minutes=minutes)}
    if purpose: payload["purpose"]=purpose
    return jwt.encode(payload,secret,algorithm=ALGORITHM)
def decode_token(token,secret): return jwt.decode(token,secret,algorithms=[ALGORITHM])
