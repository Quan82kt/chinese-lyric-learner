interface AnalysisResponse {
  lyrics: Array<{
    id: string;
    chinese: string;
    pinyin: string;
    vietnamese: string;
    startTime: number;
    endTime: number;
  }>;
  vocabulary: Array<{
    chinese: string;
    pinyin: string;
    vietnamese: string;
    explanation: string;
  }>;
}

export const analyzeLyric = async (videoId: string): Promise<AnalysisResponse> => {
  try {
    // First, get video info and subtitles
    const videoInfo = await getVideoInfo(videoId);
    
    // Then analyze with AI
    const analysis = await analyzeWithAI(videoInfo.title, videoInfo.subtitles);
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing lyric:', error);
    throw new Error('Không thể phân tích lyrics. Vui lòng thử lại.');
  }
};

const getVideoInfo = async (videoId: string) => {
  // Using a mock response for now - in production you'd use YouTube API
  // or a service like youtube-transcript to get real subtitles
  
  return {
    title: "Sample Chinese Song",
    subtitles: [
      { start: 0, end: 5, text: "你好世界" },
      { start: 5, end: 10, text: "我爱你中国" },
      { start: 10, end: 15, text: "这是一首美丽的歌" }
    ]
  };
};

const analyzeWithAI = async (title: string, subtitles: any[]): Promise<AnalysisResponse> => {
  const prompt = `
Bạn là một giáo viên tiếng Trung chuyên nghiệp. Hãy phân tích lyrics của bài hát "${title}" và cung cấp:

1. Từng câu lyrics với:
   - Hán tự gốc
   - Pinyin (với dấu thanh)
   - Bản dịch tiếng Việt tự nhiên

2. Danh sách từ vựng quan trọng với:
   - Hán tự
   - Pinyin
   - Nghĩa tiếng Việt
   - Giải thích ngữ pháp/văn hóa nếu cần

Subtitles: ${JSON.stringify(subtitles)}

Trả về JSON theo format:
{
  "lyrics": [
    {
      "id": "1",
      "chinese": "你好世界",
      "pinyin": "nǐ hǎo shì jiè",
      "vietnamese": "Xin chào thế giới",
      "startTime": 0,
      "endTime": 5
    }
  ],
  "vocabulary": [
    {
      "chinese": "世界",
      "pinyin": "shì jiè",
      "vietnamese": "thế giới",
      "explanation": "Từ ghép có nghĩa là toàn bộ vũ trụ, địa cầu"
    }
  ]
}
`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('AI analysis failed');
  }

  const data = await response.json();
  
  try {
    return JSON.parse(data.content);
  } catch (error) {
    // Fallback mock data for development
    return {
      lyrics: subtitles.map((sub, index) => ({
        id: String(index + 1),
        chinese: sub.text,
        pinyin: generateMockPinyin(sub.text),
        vietnamese: generateMockVietnamese(sub.text),
        startTime: sub.start,
        endTime: sub.end
      })),
      vocabulary: [
        {
          chinese: "你好",
          pinyin: "nǐ hǎo",
          vietnamese: "xin chào",
          explanation: "Lời chào thông dụng nhất trong tiếng Trung"
        },
        {
          chinese: "世界",
          pinyin: "shì jiè",
          vietnamese: "thế giới",
          explanation: "Từ ghép có nghĩa là toàn bộ vũ trụ, địa cầu"
        }
      ]
    };
  }
};

// Mock functions for development
const generateMockPinyin = (chinese: string): string => {
  const mockMap: Record<string, string> = {
    "你好世界": "nǐ hǎo shì jiè",
    "我爱你中国": "wǒ ài nǐ zhōng guó",
    "这是一首美丽的歌": "zhè shì yī shǒu měi lì de gē"
  };
  return mockMap[chinese] || "mock pinyin";
};

const generateMockVietnamese = (chinese: string): string => {
  const mockMap: Record<string, string> = {
    "你好世界": "Xin chào thế giới",
    "我爱你中国": "Tôi yêu Trung Quốc",
    "这是一首美丽的歌": "Đây là một bài hát đẹp"
  };
  return mockMap[chinese] || "Bản dịch tiếng Việt";
};