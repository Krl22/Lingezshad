import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Vocabulary() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWordData = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        throw new Error("Word not found. Please try another one.");
      }
      const result = await response.json();
      setData(result[0]);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto dark:bg-gray-800 ">
      <CardHeader>
        <CardTitle>Vocabulary Search</CardTitle>
        <CardDescription>
          Search for the meaning, phonetics, and usage of English words.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a word (e.g., 'hello')"
              className="mt-1 dark:bg-gray-700"
            />
          </div>
          <Button onClick={fetchWordData} disabled={!word || loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
        {data && (
          <ScrollArea className="mt-6 max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Word</h2>
                <p>{data.word}</p>
              </div>
              {data.phonetic && (
                <div>
                  <h2 className="text-lg font-semibold">Phonetic</h2>
                  <p>{data.phonetic}</p>
                </div>
              )}
              {data.phonetics && data.phonetics[0]?.audio && (
                <div>
                  <h2 className="text-lg font-semibold">Pronunciation</h2>
                  <audio controls>
                    <source src={data.phonetics[0].audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              {data.origin && (
                <div>
                  <h2 className="text-lg font-semibold">Origin</h2>
                  <p>{data.origin}</p>
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold">Meanings</h2>
                <ul className="space-y-4">
                  {data.meanings.map((meaning: any, index: number) => (
                    <li key={index}>
                      <h3 className="font-medium">{meaning.partOfSpeech}</h3>
                      <ul className="ml-6 space-y-2 list-disc">
                        {meaning.definitions.map(
                          (definition: any, defIndex: number) => (
                            <li key={defIndex}>
                              <p>
                                <span className="font-semibold">
                                  Definition:
                                </span>{" "}
                                {definition.definition}
                              </p>
                              {definition.example && (
                                <p>
                                  <span className="font-semibold">
                                    Example:
                                  </span>{" "}
                                  {definition.example}
                                </p>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by{" "}
          <a
            href="https://dictionaryapi.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            dictionaryapi.dev
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
