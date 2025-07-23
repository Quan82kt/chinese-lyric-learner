# Hướng dẫn Deploy Chinese Lyric Learner lên Vercel

## 1. Cài đặt dependencies

```bash
npm install
```

## 2. Tạo file .env.local

Tạo file `.env.local` trong thư mục root của project:

```bash
# .env.local
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Lấy OpenRouter API Key:**
1. Đăng ký tài khoản tại https://openrouter.ai/
2. Vào Settings > Keys để tạo API key mới
3. Copy API key và paste vào file .env.local

## 3. Test local

```bash
npm run dev
```

Truy cập http://localhost:8080 để test app.

## 4. Deploy lên Vercel

### Option 1: Deploy qua Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login và deploy
vercel login
vercel

# Thêm environment variable
vercel env add OPENROUTER_API_KEY
# Nhập API key khi được hỏi
```

### Option 2: Deploy qua GitHub

1. Push code lên GitHub repository
2. Kết nối repository với Vercel tại https://vercel.com/
3. Trong Vercel dashboard:
   - Vào Project Settings > Environment Variables
   - Thêm `OPENROUTER_API_KEY` với value là API key của bạn
4. Deploy tự động sẽ chạy

## 5. Cấu trúc API

App sử dụng Vercel Serverless Functions:

```
api/
└── chat.js          # OpenRouter API proxy
src/
├── api/
│   └── analyzeLyric.ts    # Client-side API calls
├── components/
│   ├── VideoPlayer.tsx
│   ├── LyricList.tsx
│   └── YoutubeInput.tsx
└── pages/
    └── Index.tsx     # Main app page
```

## 6. Bảo mật

- ✅ API key được lưu an toàn trong Vercel Environment Variables
- ✅ Không có API key nào trong frontend code
- ✅ Tất cả calls tới OpenRouter đi qua serverless function
- ✅ CORS được cấu hình properly

## 7. Features hoàn thành

- ✅ Input YouTube URL và extract video ID
- ✅ Video player với YouTube embed
- ✅ Lyrics hiển thị dạng bảng 3 cột (Hán tự | Pinyin | Nghĩa)
- ✅ Click vào lyrics để jump tới thời điểm tương ứng
- ✅ Tab riêng cho vocabulary
- ✅ Design đẹp, responsive, mobile-friendly
- ✅ Không có settings cho API key (bảo mật tuyệt đối)
- ✅ Sử dụng AI (DeepSeek) để phân tích lyrics

## 8. Sử dụng

1. Người dùng nhập link YouTube
2. App extract video ID và hiển thị video player
3. App gọi API để phân tích lyrics (qua serverless function)
4. AI phân tích và trả về lyrics + vocabulary
5. Hiển thị kết quả với highlight theo thời gian

## 9. Troubleshooting

**Lỗi "OpenRouter API key not configured":**
- Kiểm tra đã thêm OPENROUTER_API_KEY vào Vercel environment variables
- Redeploy project sau khi thêm env var

**Lỗi CORS:**
- Đảm bảo HTTP-Referer trong api/chat.js match với domain của bạn

**Video không load:**
- Kiểm tra YouTube URL format
- Một số video có thể bị restrict embed

## 10. Customization

Để thay đổi AI model, edit file `api/chat.js`:

```javascript
model: 'deepseek/deepseek-chat', // Có thể đổi thành other models
```

Models khuyên dùng cho tiếng Trung:
- `deepseek/deepseek-chat` (tốt cho tiếng Trung)
- `anthropic/claude-3-sonnet` (đắt hơn nhưng chất lượng cao)
- `openai/gpt-4` (universal nhưng đắt)