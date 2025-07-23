import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Volume2 } from 'lucide-react';

interface LyricLine {
  id: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  startTime: number;
  endTime: number;
  isActive?: boolean;
}

interface Vocabulary {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  explanation: string;
}

interface LyricListProps {
  lyrics: LyricLine[];
  vocabulary: Vocabulary[];
  onTimeClick?: (time: number) => void;
  currentTime?: number;
}

const LyricList = ({ lyrics, vocabulary, onTimeClick, currentTime = 0 }: LyricListProps) => {
  const [activeTab, setActiveTab] = useState<'lyrics' | 'vocabulary'>('lyrics');

  const playAtTime = (time: number) => {
    onTimeClick?.(time);
  };

  const getCurrentLyric = () => {
    return lyrics.find(lyric => 
      currentTime >= lyric.startTime && currentTime <= lyric.endTime
    );
  };

  const currentLyric = getCurrentLyric();

  if (lyrics.length === 0 && vocabulary.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="text-lg font-medium mb-2">Chưa có lyric để hiển thị</div>
          <div className="text-muted-foreground">
            Nhập link YouTube và nhấn "Phân tích" để bắt đầu
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'lyrics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('lyrics')}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Lyrics ({lyrics.length})
        </Button>
        <Button
          variant={activeTab === 'vocabulary' ? 'default' : 'outline'}
          onClick={() => setActiveTab('vocabulary')}
          className="flex-1"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          Từ vựng ({vocabulary.length})
        </Button>
      </div>

      {/* Lyrics Tab */}
      {activeTab === 'lyrics' && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-chinese-red">
              歌词学习 (Học qua lời bài hát)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lyrics.map((lyric, index) => (
                <div
                  key={lyric.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    currentLyric?.id === lyric.id
                      ? 'bg-gradient-gold border-chinese-gold shadow-gold'
                      : 'bg-card hover:bg-muted/50'
                  }`}
                  onClick={() => playAtTime(lyric.startTime)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Chinese Characters */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Hán tự
                      </div>
                      <div className={`text-lg font-medium ${
                        currentLyric?.id === lyric.id ? 'text-chinese-red' : ''
                      }`}>
                        {lyric.chinese}
                      </div>
                    </div>

                    {/* Pinyin */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Pinyin
                      </div>
                      <div className="text-lg font-mono text-chinese-gold">
                        {lyric.pinyin}
                      </div>
                    </div>

                    {/* Vietnamese Translation */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Nghĩa tiếng Việt
                      </div>
                      <div className="text-lg">
                        {lyric.vietnamese}
                      </div>
                    </div>
                  </div>

                  {/* Time indicator */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(lyric.startTime / 60)}:{String(Math.floor(lyric.startTime % 60)).padStart(2, '0')}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAtTime(lyric.startTime);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Phát
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vocabulary Tab */}
      {activeTab === 'vocabulary' && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-chinese-red">
              词汇学习 (Từ vựng quan trọng)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {vocabulary.map((word, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Từ
                      </div>
                      <div className="text-xl font-medium text-chinese-red">
                        {word.chinese}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Phát âm
                      </div>
                      <div className="text-lg font-mono text-chinese-gold">
                        {word.pinyin}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Nghĩa
                      </div>
                      <div className="text-lg">
                        {word.vietnamese}
                      </div>
                    </div>
                  </div>

                  {word.explanation && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Giải thích
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {word.explanation}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LyricList;