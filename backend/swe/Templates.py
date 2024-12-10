# Template definitions
from typing import Dict
from swe.State import ProjectTemplate, ProjectType


TEMPLATES = {
    ProjectType.FASTAPI: ProjectTemplate(
        name="FastAPI Backend",
        type=ProjectType.FASTAPI,
        files={
            "app/main.py": """
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .auth import router as auth_router
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
""",
            "app/database.py": """
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""",
            "app/config.py": """
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
""",
            "app/models.py": """
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
""",
            "app/schemas.py": """
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
""",
            "app/auth.py": """
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db
from .config import get_settings

router = APIRouter()
settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

@router.post("/token", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
""",
            "tests/conftest.py": """
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
""",
            "tests/test_auth.py": """
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success(client):
    response = client.post(
        "/auth/token",
        data={"username": "test@example.com", "password": "password"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"
""",
        },
        dependencies={
            "fastapi": "^0.104.1",
            "uvicorn": "^0.24.0",
            "sqlalchemy": "^2.0.23",
            "pydantic": "^2.5.1",
            "pydantic-settings": "^2.1.0",
            "python-jose[cryptography]": "^3.3.0",
            "passlib[bcrypt]": "^1.7.4",
            "python-multipart": "^0.0.6",
            "email-validator": "^2.1.0.post1",
            "psycopg2-binary": "^2.9.9",
        },
        dev_dependencies={
            "pytest": "^7.4.3",
            "httpx": "^0.25.1",
            "black": "^23.11.0",
            "isort": "^5.12.0",
            "flake8": "^6.1.0",
            "pytest-cov": "^4.1.0",
        },
    ),
    ProjectType.REACT: ProjectTemplate(
        name="React Frontend Enhanced",
        type=ProjectType.REACT,
        files={
            # Redux Store Setup
            "src/store/index.ts": """
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
""",
            "src/store/slices/authSlice.ts": """
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
""",
            "src/store/api/apiSlice.ts": """
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post', 'Comment'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => 'users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: 'users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getPosts: builder.query({
      query: (page = 1) => `posts?page=${page}`,
      providesTags: ['Post'],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: 'posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetPostsQuery,
  useCreatePostMutation,
} = apiSlice;
""",
            # Enhanced Components
            "src/components/features/Posts/PostCard.tsx": """
import { formatDistance } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Heart, MessageCircle, Share } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      name: string;
      avatar: string;
    };
    likesCount: number;
    commentsCount: number;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <p className="text-sm text-gray-500">
            {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Heart className="w-4 h-4 mr-2" />
          {post.likesCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4 mr-2" />
          {post.commentsCount}
        </Button>
        <Button variant="ghost" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
""",
            "src/components/features/Posts/CreatePostForm.tsx": """
import { useState } from 'react';
import { useCreatePostMutation } from '../../../store/api/apiSlice';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { useToast } from '../../../hooks/useToast';

export function CreatePostForm() {
  const [content, setContent] = useState('');
  const [createPost, { isLoading }] = useCreatePostMutation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPost({ content }).unwrap();
      setContent('');
      toast({
        title: 'Success',
        description: 'Post created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? 'Posting...' : 'Post'}
      </Button>
    </form>
  );
}
""",
            "src/components/features/Profile/ProfileStats.tsx": """
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface ProfileStatsProps {
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-sm">Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{stats.posts}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-sm">Followers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{stats.followers}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-sm">Following</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-center">{stats.following}</p>
        </CardContent>
      </Card>
    </div>
  );
}
""",
            "src/components/common/DataTable/index.tsx": """
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Button } from '../../ui/button';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
""",
            "src/hooks/useAuth.ts": """
import { useAppDispatch, useAppSelector } from './useStore';
import { setCredentials, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      dispatch(setCredentials(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
  };
};
""",
        },
        dependencies={
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.19.0",
            "axios": "^1.6.2",
            "@hookform/resolvers": "^3.3.2",
            "react-hook-form": "^7.48.2",
            "zod": "^3.22.4",
            "@radix-ui/react-toast": "^1.1.5",
            "class-variance-authority": "^0.7.0",
            "clsx": "^2.0.0",
            "tailwind-merge": "^2.0.0",
            "lucide-react": "^0.292.0",
            "@reduxjs/toolkit": "^1.9.7",
            "react-redux": "^8.1.3",
            "@tanstack/react-table": "^8.10.7",
            "date-fns": "^2.30.0",
        },
        dev_dependencies={
            "@types/react": "^18.2.37",
            "@types/react-dom": "^18.2.15",
            "@types/node": "^20.9.2",
            "@typescript-eslint/eslint-plugin": "^6.10.0",
            "@typescript-eslint/parser": "^6.10.0",
            "@vitejs/plugin-react": "^4.2.0",
            "autoprefixer": "^10.4.16",
            "eslint": "^8.53.0",
            "eslint-plugin-react-hooks": "^4.6.0",
            "eslint-plugin-react-refresh": "^0.4.4",
            "postcss": "^8.4.31",
            "prettier": "^3.1.0",
            "tailwindcss": "^3.3.5",
            "typescript": "^5.2.2",
            "vite": "^5.0.0",
            "@testing-library/react": "^14.1.2",
            "@testing-library/jest-dom": "^6.1.4",
            "jest": "^29.7.0",
            "ts-jest": "^29.1.1",
            "msw": "^2.0.8",
            "@redux-devtools/extension": "^3.2.6",
        },
    ),
    ProjectType.FASTAPI_AUTH: ProjectTemplate(
        name="FastAPI Auth Template",
        type=ProjectType.FASTAPI_AUTH,
        files={
            "app/main.py": """
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .auth import auth_router
from .database import engine
from . import models
from .auth import get_current_user
from .models import User

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FastAPI Auth Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.username}, this is a protected route"}
""",
            "app/database.py": """
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""",
            "app/models.py": """
from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
""",
            "app/schemas.py": """
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
""",
            "app/config.py": """
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Auth Service"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()
""",
            "app/auth.py": """
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas
from .database import get_db
from .config import get_settings

auth_router = APIRouter()
settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@auth_router.post("/register", response_model=schemas.UserResponse)
async def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | (models.User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    db_user = models.User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@auth_router.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/me", response_model=schemas.UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
""",
            "tests/conftest.py": """
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
""",
            "tests/test_auth.py": """
from fastapi.testclient import TestClient
from app.main import app
from app.auth import get_password_hash
from app.models import User

def test_register(client, db):
    response = client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"

def test_login(client, db):
    # Create test user
    db_user = User(
        email="test@example.com",
        username="testuser",
        hashed_password=get_password_hash("testpass123")
    )
    db.add(db_user)
    db.commit()

    response = client.post(
        "/auth/token",
        data={"username": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
""",
        },
        dependencies={
            "fastapi": "^0.104.1",
            "uvicorn": "^0.24.0",
            "sqlalchemy": "^2.0.23",
            "pydantic": "^2.5.1",
            "pydantic-settings": "^2.1.0",
            "python-jose[cryptography]": "^3.3.0",
            "passlib[bcrypt]": "^1.7.4",
            "python-multipart": "^0.0.6",
            "email-validator": "^2.1.0.post1",
            "psycopg2-binary": "^2.9.9",
        },
        dev_dependencies={
            "pytest": "^7.4.3",
            "httpx": "^0.25.1",
            "black": "^23.11.0",
            "isort": "^5.12.0",
            "flake8": "^6.1.0",
            "pytest-cov": "^4.1.0",
        },
    ),
    ProjectType.REACT_AUTH: ProjectTemplate(
        name="React Auth Template",
        type=ProjectType.REACT_AUTH,
        files={
            "src/context/AuthContext.js": """
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('http://your-api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.access_token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const register = useCallback(async (email, password, username) => {
    try {
      const response = await fetch('http://your-api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
""",
            "src/components/auth/ProtectedRoute.js": """
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
""",
            "src/components/auth/LoginForm.js": """
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { success, error } = await login(email, password);
    
    if (success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(error);
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};
""",
            "src/components/auth/RegisterForm.js": """
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { success, error } = await register(
      formData.email,
      formData.password,
      formData.username
    );

    if (success) {
      navigate('/login');
    } else {
      setError(error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
};
""",
            "src/App.js": """
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};
""",
        },
        dependencies={
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.20.0",
            "@tailwindcss/forms": "^0.5.7",
            "tailwindcss": "^3.3.5",
            "autoprefixer": "^10.4.16",
            "postcss": "^8.4.31",
        },
        dev_dependencies={
            "@testing-library/react": "^14.1.2",
            "@testing-library/jest-dom": "^6.1.4",
            "@testing-library/user-event": "^14.5.1",
            "jest": "^29.7.0",
        },
    ),
}


DOCKER_TEMPLATES = {
    "fastapi": {
        "Dockerfile": """FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]""",
        "docker-compose.yml": """version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - ENV=development
    depends_on:
      - db
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:""",
    }
}

CI_TEMPLATES = {
    "github": {
        "python": """name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install pytest
    - name: Run tests
      run: |
        pytest
    - name: Run linting
      run: |
        pip install flake8
        flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to production
      run: |
        echo "Add your deployment commands here" """,
        "node": """name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16.x'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Run linting
      run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to production
      run: |
        echo "Add your deployment commands here" """,
    }
}
CLOUD_TEMPLATES = {
    "aws": {
        "terraform": {
            "main.tf": """terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_ecr_repository" "app" {
  name = var.app_name
}

resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
}

resource "aws_ecs_task_definition" "app" {
  family                   = var.app_name
  container_definitions    = jsonencode([
    {
      name      = var.app_name
      image     = "${aws_ecr_repository.app.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
        }
      ]
    }
  ])
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
}

resource "aws_ecs_service" "app" {
  name            = var.app_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"
}""",
            "variables.tf": """variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "app_name" {
  description = "Application name"
  type        = string
}""",
        }
    },
    "gcp": {
        "terraform": {
            "main.tf": """terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "app" {
  name     = var.app_name
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.app_name}:latest"
      }
    }
  }
}""",
            "variables.tf": """variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  default     = "us-central1"
}

variable "app_name" {
  description = "Application name"
  type        = string
}""",
        }
    },
}
