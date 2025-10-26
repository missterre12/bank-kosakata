import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

type WordBank = {
  textId: string;
  textKr: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
  id: string;
};

const alphabets = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const hangeul = [
  "ㄱ",
  "ㄴ",
  "ㄷ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅅ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
  "ㄲ",
  "ㄸ",
  "ㅃ",
  "ㅆ",
  "ㅉ",
];

function RouteComponent() {
  const [showForm, setShowForm] = useState(false);
  const [wordBank, setWordBank] = useState<WordBank[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWordBank, setSelectedWordBank] = useState<string | undefined>(
    undefined
  );
  const [filter, setFilter] = useState("id");

  const filteredWordBank = searchQuery
    ? wordBank.filter(
        (word) =>
          word.textId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.textKr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : wordBank;

  const groupedWords = filteredWordBank.reduce(
    (acc, word) => {
      const firstLetter = word.textId[0]?.toLowerCase();

      if (acc[firstLetter]) {
        acc[firstLetter].push(word);
      }

      return acc;
    },
    Object.fromEntries(alphabets.map((letter) => [letter, [] as WordBank[]]))
  );

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    wordId?: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const formElement = e.target as HTMLFormElement;
    const fd = new FormData(formElement);
    const textId = fd.get("text-id")?.toString() ?? "";
    const textKr = fd.get("text-kr")?.toString() ?? "";
    const notes = fd.get("notes")?.toString() ?? "";

    setWordBank((wordBank) => {
      if (wordId) {
        return wordBank.map((word) => {
          if (word.id === wordId) {
            return {
              ...word,
              textId: textId,
              textKr: textKr,
              notes: notes,
              updatedAt: Date.now(),
            };
          }
          return word;
        });
      } else {
        return [
          ...wordBank,
          {
            id: `ID-${Date.now()}`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            textId: textId,
            textKr: textKr,
            notes: notes,
          },
        ];
      }
    });
    formElement.reset();
    setShowForm(false);
  };

  return (
    <div className="flex flex-col flex-1 p-15 gap-5 max-w-1/2 mx-auto">
      <div className="flex flex-col gap-10">
        <p className="text-center text-2xl font-bold">
          Bank Kosakata Indonesia - Korea
        </p>
        <div className="flex-1 flex flex-row gap-2.5">
          <input
            className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5"
            type="text"
            placeholder="Cari kata..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="items-center justify-center flex text-white w-12 h-12 rounded-lg bg-sky-600"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col gap-2.5">
          <label htmlFor="letter">Pilih Huruf</label>
          <div className="flex flex-wrap gap-2.5">
            {filter === "id" &&
              alphabets.map((letter) => {
                return (
                  <button
                    key={letter}
                    className="rounded-full bg-sky-300 h-12 w-12 text-lg"
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            {filter === "kr" &&
              hangeul.map((letter) => {
                return (
                  <button
                    key={letter}
                    className="rounded-full bg-sky-300 h-12 w-12 text-lg"
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Filter</label>
            <button
              onClick={() => {
                setFilter("id");
              }}
              className={
                filter === "id"
                  ? "h-10 w-12 bg-red-200 rounded-lg"
                  : "h-10 w-12 bg-sky-200 rounded-lg"
              }
            >
              ID
            </button>
            <button
              onClick={() => {
                setFilter("kr");
              }}
              className={
                filter === "kr"
                  ? "h-10 w-12 bg-red-200 rounded-lg"
                  : "h-10 w-12 bg-sky-200 rounded-lg"
              }
            >
              KR
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {alphabets.map((letter) => {
          const wordsInGroup = groupedWords[letter];

          if (wordsInGroup.length === 0) {
            return null;
          }

          return (
            <div
              key={letter}
              className="bg-white p-4 flex flex-col gap-2 rounded-lg"
            >
              <h2 className="text-xl font-bold">{letter.toUpperCase()}</h2>
              <div>
                {wordsInGroup.map((word) => {
                  return (
                    <button
                      onClick={() => {
                        setSelectedWordBank(word.id);
                        setShowForm(true);
                      }}
                      key={word.id}
                      className="flex flex-row items-center justify-between    flex-1 w-full"
                    >
                      <span>{word.textId}</span>
                      <span>{word.textKr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* <pre>{JSON.stringify(wordBank, null, 2)}</pre> */}
      {showForm && (
        <FormModal
          onClose={() => {
            setShowForm(false);
            setSelectedWordBank(undefined);
          }}
          onSubmit={(e) => {
            handleSubmit(e, selectedWordBank);
            setSelectedWordBank(undefined);
          }}
          id={selectedWordBank}
          wordBank={wordBank}
        />
      )}
    </div>
  );
}

type FormModalProps = {
  onClose?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  id?: string;
  wordBank: WordBank[];
};

function FormModal(props: FormModalProps) {
  const textIdRef = useRef<HTMLInputElement>(null);
  const textKrRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (props.id) {
      const selectedWordBank = props.wordBank.find((word) => {
        return word.id === props.id;
      });
      if (selectedWordBank) {
        if (textIdRef.current) {
          textIdRef.current!.value = selectedWordBank.textId;
        }
        if (textKrRef.current) {
          textKrRef.current!.value = selectedWordBank.textKr;
        }

        if (notesRef.current) {
          notesRef.current!.value = selectedWordBank.notes;
        }
      }
    }
  }, [props.id]);

  return (
    <div className="bg-black/20 flex items-center justify-center h-screen w-screen absolute top-0 left-0">
      <form action="" className="contents" onSubmit={props.onSubmit}>
        <div className="bg-white relative p-5 rounded-lg flex flex-col gap-5 min-w-[25vw]">
          <button
            onClick={props.onClose}
            className="absolute top-0 right-0 p-2.5 text-red-500"
            type="button"
          >
            <XIcon />
          </button>

          <p className="font-medium text-lg flex justify-center">
            {props.id ? "Detail Kosakata" : "Tambah Kosakata"}
          </p>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="text-id">ID</label>
            <input
              ref={textIdRef}
              className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              name="text-id"
              id="text-id"
              type="text"
              placeholder="Masukkan kata..."
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label htmlFor="text-kr">KR</label>
            <input
              ref={textKrRef}
              className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-10"
              name="text-kr"
              id="text-kr"
              type="text"
              placeholder="Masukkan kata..."
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <textarea
              ref={notesRef}
              className="bg-white w-full border border-neutral-500/70 rounded-lg ps-2.5 h-18"
              name="notes"
              id="notes"
              placeholder="Masukkan catatan..."
            ></textarea>
          </div>
          <button
            className="bg-sky-600 rounded-lg w-full h-12 text-white"
            type="submit"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
