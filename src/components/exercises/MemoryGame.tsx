import { useState } from "react";
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
    <div className="container px-4 py-8 mx-auto">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {title}
          </CardTitle>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">Moves: {moves}</span>
            <Button onClick={resetGame} size="sm" variant="outline">
              <RotateCw className="mr-2 w-4 h-4" />
              Restart Game
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tablero de juego */}
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  card.flipped || card.matched
                    ? "bg-card border-2 border-primary/30"
                    : "bg-secondary hover:bg-secondary/80"
                } ${card.matched ? "opacity-70" : ""}`}
              >
                {card.flipped || card.matched ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={card.imageUrl}
                      alt={card.value}
                      className="object-contain mb-2 w-16 h-16"
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
                            ? "text-primary animate-pulse"
                            : ""
                        }`}
                      />
                    </Button>
                    <span className="mt-1 text-sm font-medium capitalize text-foreground">
                      {card.value}
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl text-muted-foreground">?</div>
                )}
              </div>
            ))}
          </div>

          {/* Mensaje de juego completado */}
          {gameComplete && (
            <div className="p-4 mt-6 text-center bg-green-50 rounded-lg border border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <h3 className="mb-2 text-xl font-bold text-green-800 dark:text-green-400">
                🎉 Congratulations!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                You completed the game in {moves} moves!
              </p>
              <Button
                onClick={resetGame}
                className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
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
