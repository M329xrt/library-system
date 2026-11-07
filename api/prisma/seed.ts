import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // Create three genres
  const fiction = await prisma.genre.upsert({
    where: { name: "Fiction" },
    update: {},
    create: { name: "Fiction" },
  });

  const technology = await prisma.genre.upsert({
    where: { name: "Technology" },
    update: {},
    create: { name: "Technology" },
  });

  const science = await prisma.genre.upsert({
    where: { name: "Science" },
    update: {},
    create: { name: "Science" },
  });
  const history = await prisma.genre.upsert({
  where: { name: "History" },
  update: {},
  create: { name: "History" },
});
  // Sample books
  const books = [
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      isbn: "9780385474542",
      genreId: fiction.id,
    },
    {
      title: "The River Between",
      author: "Ngugi wa Thiong'o",
      isbn: "9780435905484",
      genreId: fiction.id,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      genreId: fiction.id,
    },
    {
      title: "Purple Hibiscus",
      author: "Chimamanda Ngozi Adichie",
      isbn: "9781616202415",
      genreId: fiction.id,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      genreId: technology.id,
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas",
      isbn: "9780135957059",
      genreId: technology.id,
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262046305",
      genreId: technology.id,
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      genreId: science.id,
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      isbn: "9780198788607",
      genreId: science.id,
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "9780345539434",
      genreId: science.id,
    },
        {
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      isbn: "9780316548182",
      genreId: history.id,
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      isbn: "9780553296983",
      genreId: history.id,
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      genreId: history.id,
    },
    {
      title: "Born a Crime",
      author: "Trevor Noah",
      isbn: "9780399588198",
      genreId: history.id,
    },
    {
      title: "The Art of War",
      author: "Sun Tzu",
      isbn: "9781590302255",
      genreId: history.id,
    },
  ];

  // Insert books without creating duplicates
  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: {
          connect: { id: book.genreId },
        },
      },
    });
  }

  console.log("Seeding completed!");
  console.log("4 genres and 15 books are ready.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });