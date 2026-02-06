"use server";

const words = [
  "Turnip",
  "Carrot",
  "Cucumber",
  "Tomato",
  "Banana",
  "Apple",
  "Lemon",
  "Orange",
  "Clementine",
  "Pineapple",
];

export async function getWord(id: string) {
  return (
    words[id.charCodeAt(0) % words.length] +
    ((id.charCodeAt(0) +
      id.charCodeAt(1) +
      id.charCodeAt(2) +
      id.charCodeAt(3)) %
      99)
  );
}
