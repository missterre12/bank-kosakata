import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  PlusIcon,
  RefreshCcw,
  SquareCheck,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { pb } from "../../pocketbase";

export const Route = createFileRoute("/_protected/")({
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

function getInitialConsonant(char: string): string {
  const code = char.charCodeAt(0);

  if (code >= 0xac00 && code <= 0xd7a3) {
    const initialConsonants = [
      "ㄱ",
      "ㄲ",
      "ㄴ",
      "ㄷ",
      "ㄸ",
      "ㄹ",
      "ㅁ",
      "ㅂ",
      "ㅃ",
      "ㅅ",
      "ㅆ",
      "ㅇ",
      "ㅈ",
      "ㅉ",
      "ㅊ",
      "ㅋ",
      "ㅌ",
      "ㅍ",
      "ㅎ",
    ];
    const index = Math.floor((code - 0xac00) / 588);
    return initialConsonants[index];
  }

  return char;
}

function RouteComponent() {
  pb.health.check().then(console.log);
  const router = useRouter();
  const handleLogout = () => {
    pb.authStore.clear();
    router.navigate({
      to: "/login",
      replace: true,
    });
  };
  const [showForm, setShowForm] = useState(false);
  const [wordBank, setWordBank] = useState<WordBank[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWordBank, setSelectedWordBank] = useState<string | undefined>(
    undefined
  );
  const [filter, setFilter] = useState("id");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const filteredWordBank = searchQuery
    ? wordBank.filter(
        (word) =>
          word.textId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.textKr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : wordBank;

  const groupedWords = filteredWordBank.reduce(
    (acc, word) => {
      let firstLetter: string;

      if (filter === "id") {
        firstLetter = word.textId[0]?.toLowerCase();
      } else {
        const firstChar = word.textKr[0];
        firstLetter = firstChar ? getInitialConsonant(firstChar) : "";
      }

      if (acc[firstLetter]) {
        acc[firstLetter].push(word);
      }

      return acc;
    },
    Object.fromEntries(
      (filter === "id" ? alphabets : hangeul).map((letter) => [
        letter,
        [] as WordBank[],
      ])
    )
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

  const lettersToDisplay = filter === "id" ? alphabets : hangeul;
  const filteredLetters = selectedLetter ? [selectedLetter] : lettersToDisplay;

  return (
    <div className="flex flex-col">
      <div className="ms-auto flex p-5">
        <button
          type="button"
          className="bg-sky-600 rounded-lg w-20 h-12 text-white hover:cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
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
              onClick={() => setShowForm(true)}
              className="items-center justify-center flex text-white w-12 h-12 rounded-lg bg-sky-600"
            >
              <PlusIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="flex items-center justify-between">
              <label className="font-medium" htmlFor="letter">
                Pilih Huruf
              </label>
              {selectedLetter && (
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="text-sm text-sky-600 underline"
                >
                  Tampilkan Semua
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {filter === "id" &&
                alphabets.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`rounded-full h-12 w-12 text-lg ${
                      selectedLetter === letter
                        ? "bg-sky-600 text-white"
                        : "bg-sky-300"
                    }`}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              {filter === "kr" &&
                hangeul.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`rounded-full h-12 w-12 text-lg ${
                      selectedLetter === letter
                        ? "bg-sky-600 text-white"
                        : "bg-sky-300"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Filter</label>
            <button
              onClick={() => {
                setFilter("id");
                setSelectedLetter(null);
              }}
              className={`h-10 w-12 rounded-lg ${
                filter === "id" ? "bg-neutral-300" : "bg-sky-200"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => {
                setFilter("kr");
                setSelectedLetter(null);
              }}
              className={`h-10 w-12 rounded-lg ${
                filter === "kr" ? "bg-neutral-300" : "bg-sky-200"
              }`}
            >
              KR
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filteredLetters.map((letter) => {
            const wordsInGroup = groupedWords[letter];

            if (wordsInGroup.length === 0) {
              return null;
            }

            const sortedWords = [...wordsInGroup].sort((a, b) => {
              if (filter === "id") {
                return a.textId.localeCompare(b.textId);
              } else {
                return a.textKr.localeCompare(b.textKr, "ko");
              }
            });

            return (
              <div
                key={letter}
                className="bg-white p-4 flex flex-col gap-2 rounded-lg"
              >
                <h2 className="text-xl font-bold">
                  {filter === "id" ? letter.toUpperCase() : letter}
                </h2>
                <div>
                  {sortedWords.map((word) => (
                    <button
                      onClick={() => {
                        setSelectedWordBank(word.id);
                        setShowForm(true);
                      }}
                      key={word.id}
                      className="flex flex-row items-center justify-between flex-1 w-full"
                    >
                      {filter === "id" && (
                        <>
                          <span>{word.textId}</span>
                          <span>{word.textKr}</span>
                        </>
                      )}
                      {filter === "kr" && (
                        <>
                          <span>{word.textKr}</span>
                          <span>{word.textId}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

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
            onDelete={(id, form) => {
              if (id) {
                setWordBank((wordBank) => {
                  return wordBank.filter((word) => {
                    return word.id !== id;
                  });
                });
                setShowForm(false);
                setSelectedWordBank(undefined);
              }
              form?.reset();
            }}
          />
        )}
      </div>
    </div>
  );
}

type FormModalProps = {
  onClose?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  id?: string;
  wordBank: WordBank[];
  onDelete?: (id: string, form?: HTMLFormElement) => void;
};

function FormModal(props: FormModalProps) {
  const textIdRef = useRef<HTMLInputElement>(null);
  const textKrRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (props.id) {
      const selectedWordBank = props.wordBank.find(
        (word) => word.id === props.id
      );
      if (selectedWordBank) {
        if (textIdRef.current) {
          textIdRef.current.value = selectedWordBank.textId;
        }
        if (textKrRef.current) {
          textKrRef.current.value = selectedWordBank.textKr;
        }
        if (notesRef.current) {
          notesRef.current.value = selectedWordBank.notes;
        }
      }
    }
  }, [props.id, props.wordBank]);

  return (
    <div className="bg-black/20 flex items-center justify-center h-screen w-screen absolute top-0 left-0">
      <form
        action=""
        className="contents"
        onSubmit={props.onSubmit}
        ref={formRef}
      >
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
          <div className="flex flex-row gap-2.5">
            <button
              data-id={props.id ? true : false}
              className="data-[id=false]:bg-neutral-400 data-[id=true]:bg-red-500 rounded-lg w-full h-12 text-white flex flex-row items-center justify-center gap-1"
              type="button"
              onClick={() => {
                if (formRef.current) {
                  props.onDelete?.(props?.id ?? "", formRef.current);
                }
              }}
            >
              {props.id ? (
                <>
                  <Trash2Icon /> Hapus
                </>
              ) : (
                <>
                  <RefreshCcw /> Reset
                </>
              )}
            </button>
            <button
              className="bg-sky-600 rounded-lg w-full h-12 text-white flex flex-row items-center justify-center gap-1"
              type="submit"
            >
              <SquareCheck /> Simpan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
