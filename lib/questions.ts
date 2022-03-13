export type Question = {
  questionText: string;
  image?: string;
  answers: string[];
  correctAnswerIndex?: number;
};

const quizQuestions: Question[] = [
  {
    questionText: "Which tennis player has won 23 Grand Slam Titles",
    image: 
    "https://images.unsplash.com/photo-1519611103964-90f61a50d3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVubmlzJTIwYmFsbHxlbnwwfHwwfHw%3D&w=1000&q=80",
    answers: [
      "Trick question: none of them! It's Serena Williams",
      "Roger Federer",
      "Maria Sharapova",
      "Rafael Nadal",
    ],
    correctAnswerIndex: 0,
  },
  {
    questionText: "What is the capital of Brazil?",
    // image: "https://www.carlogos.org/logo/Lexus-symbol-640x480.jpg",
    answers: ["Lisbon", "Rio de Janeiro", "Valencia", "São Paulo"],
    correctAnswerIndex: 3,
  },
  {
    questionText: "Where is this monolith located?",
    image: "https://i.imgur.com/15Z9qy6.jpg",
    answers: ["Sri Lanka", "Colombia", "Nigeria", "South Africa"],
    correctAnswerIndex: 2,
  },
  {
    questionText:
      "What is the currency of Denmark?",
    answers: ["Franc", "Euros", "Danish Ruble", "Krone"],
    correctAnswerIndex: 2,
  },
  {
    questionText: "What was the colour of Apple's first logo?",
    answers: ["Rainbow", "Black & White", "Blue", "Black"],
    correctAnswerIndex: 1,
  },
];

export default quizQuestions;
