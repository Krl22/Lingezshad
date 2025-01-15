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
import { Tooltip } from "@/components/ui/tooltip"; // ShadCN Tooltip para mejorar la experiencia de usuario

// Definir el tipo para los datos de la gramática
interface GrammarExample {
  rule: string;
  description: string;
  example: string;
  note: string;
}

export function Grammar() {
  const [search, setSearch] = useState<string>(""); // Especificando el tipo de estado para 'search'
  const [showDetails, setShowDetails] = useState<boolean>(false); // Especificando el tipo de estado para 'showDetails'

  // Datos simulados para el ejemplo
  const exampleGrammar: GrammarExample = {
    rule: "Present Simple",
    description:
      "El 'Present Simple' se utiliza para hablar de acciones habituales o hechos generales.",
    example: "I eat breakfast every day.",
    note: "Se utiliza con sujetos en tercera persona singular (he, she, it) añadiendo una 's' al verbo.",
  };

  return (
    <Card className="max-w-2xl mx-auto rounded-lg shadow-lg dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Grammar Guide</CardTitle>
        <CardDescription>Learn English grammar rules easily.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input para búsqueda */}
          <div>
            <Label htmlFor="search" className="text-lg">
              Grammar Topic
            </Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for grammar topic (e.g., 'Present Simple')"
              className="mt-1 text-white dark:bg-gray-700"
            />
          </div>

          {/* Botón de búsqueda */}
          <Button
            onClick={() => setShowDetails(true)}
            disabled={!search}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Search
          </Button>

          {/* Resultado con reglas gramaticales */}
          {showDetails && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold">{exampleGrammar.rule}</h3>
                <p>{exampleGrammar.description}</p>
                <p className="mt-2">
                  <span className="font-semibold">Example:</span>{" "}
                  {exampleGrammar.example}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Note:</span>{" "}
                  {exampleGrammar.note}
                </p>
              </div>

              {/* Tooltip de ayuda adicional */}
              <Tooltip>
                <Button
                  variant="outline"
                  className="w-full text-white bg-gray-600"
                >
                  More Details
                </Button>
              </Tooltip>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
        <p>Powered by your imagination!</p>
      </CardFooter>
    </Card>
  );
}
