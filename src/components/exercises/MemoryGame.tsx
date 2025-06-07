import { useState, useEffect } from "react";
import { Volume2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MemoryCard = {
  id: string;
  value: string; // Cambié "animal" por "value" para hacerlo genérico
  audioUrl: string;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
};

type MemoryGameProps = {
  title: string;
  cardPairs: {
    value: string;
    audioUrl: string;
    imageUrl: string;
  }[];
};

export default function MemoryGame({ title, cardPairs }: MemoryGameProps) {
  // Generar las cartas iniciales a partir de los pares proporcionados
  const generateInitialCards = (): MemoryCard[] => {
    return cardPairs.flatMap((pair, index) => [
      {
        id: `${pair.value}-1-${index}`,
        value: pair.value,
        audioUrl: pair.audioUrl,
        imageUrl: pair.imageUrl,
        flipped: false,
        matched: false,
      },
      {
        id: `${pair.value}-2-${index}`,
        value: pair.value,
        audioUrl: pair.audioUrl,
        imageUrl: pair.imageUrl,
        flipped: false,
        matched: false,
      },
    ]);
  };

  const [cards, setCards] = useState<MemoryCard[]>(() =>
    shuffleCards([...generateInitialCards()])
  );
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);

  // Barajar cartas
  function shuffleCards(cardArray: MemoryCard[]): MemoryCard[] {
    return cardArray.sort(() => Math.random() - 0.5);
  }

  // Reproducir audio
  const playAudio = (audioUrl: string) => {
    setAudioPlaying(audioUrl);
    new Audio(audioUrl).play().finally(() => setAudioPlaying(null));
  };

  // Manejar clic en carta
  const handleCardClick = (index: number) => {
    if (
      cards[index].flipped ||
      cards[index].matched ||
      flippedCards.length >= 2
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    playAudio(newCards[index].audioUrl);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (cards[firstIndex].value === cards[secondIndex].value) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIndex].matched = true;
          matchedCards[secondIndex].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          if (matchedCards.every((card) => card.matched)) {
            setGameComplete(true);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIndex].flipped = false;
          resetCards[secondIndex].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  // Reiniciar juego
  const resetGame = () => {
    setCards(shuffleCards([...generateInitialCards()]));
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">Moves: {moves}</span>
            <Button onClick={resetGame} size="sm" variant="outline">
              <RotateCw className="mr-2 h-4 w-4" />
              Restart Game
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tablero de juego */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  card.flipped || card.matched
                    ? "bg-white border-2 border-blue-300"
                    : "bg-blue-100 hover:bg-blue-200"
                } ${card.matched ? "opacity-70" : ""}`}
              >
                {card.flipped || card.matched ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={card.imageUrl}
                      alt={card.value}
                      className="h-16 w-16 object-contain mb-2"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(card.audioUrl);
                      }}
                      disabled={audioPlaying === card.audioUrl}
                    >
                      <Volume2
                        className={`h-4 w-4 ${
                          audioPlaying === card.audioUrl
                            ? "text-blue-500 animate-pulse"
                            : ""
                        }`}
                      />
                    </Button>
                    <span className="mt-1 text-sm capitalize font-medium">
                      {card.value}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl">?</div>
                )}
              </div>
            ))}
          </div>

          {/* Mensaje de juego completado */}
          {gameComplete && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
              <h3 className="text-xl font-bold text-green-800 mb-2">
                🎉 Congratulations!
              </h3>
              <p className="text-green-700">
                You completed the game in {moves} moves!
              </p>
              <Button
                onClick={resetGame}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
