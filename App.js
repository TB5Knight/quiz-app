import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ButtonGroup } from '@rneui/themed';

const Stack = createNativeStackNavigator();

// Quiz data structure
const sampleData = [
  {
    prompt: "A college basketball game consists of four quarters, just like the NBA.",
    type: "true-false",
    choices: ["True", "False"],
    correct: 1,
  },
  {
    prompt: "Which of the following are NCAA college basketball conferences?",
    type: "multiple-answer",
    choices: ["Big 12", "Eastern Conference", "SEC", "Western Conference"],
    correct: [0, 2],
  },
  {
    prompt: "How long is the shot clock in men’s college basketball?",
    type: "multiple-choice",
    choices: ["35 seconds", "30 seconds", "14 seconds", "24 seconds"],
    correct: 1,
  },
  {
    prompt: "The NCAA tournament is commonly known as March Madness.",
    type: "true-false",
    choices: ["True", "False"],
    correct: 0,
  },
 {
    prompt: "What is the name of the award given to the best player of the NCAA Division I Men's Basketball Tournament? ",
    type: "multiple-choice",
    choices: ["Naismith Men's College Player of the Year", "Most Outstanding Player", "AP Player of the Year", " John R. Wooden Award"],
    correct: 1,
  },
];

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Start Quiz"
        onPress={() =>
          navigation.replace("Question", {
            data: sampleData,
            index: 0,
            answers: [],
          })
        }
      />
    </View>
  );
}

//export function Question({ route, navigation }) {
export function Question({ route, navigation }) {
  const { data, index, answers } = route.params;
  const question = data[index];

  const isMulti = question.type === "multiple-answer";

  const [selected, setSelected] = useState(
    isMulti ? [] : null
  );

  const handleSelect = (value) => {
    if (isMulti) {
      if (selected.includes(value)) {
        setSelected(selected.filter(i => i !== value));
      } else {
        setSelected([...selected, value]);
      }
    } else {
      setSelected(value);
    }
  };

  const goNext = () => {
    const updatedAnswers = [...answers, selected];

if (index + 1 < data.length) {
navigation.replace("Question", {
 data,
index: index + 1,
answers: updatedAnswers,
 });
 } else {
navigation.replace("Summary", {
data,
answers: updatedAnswers,
 });
}
};

return (
 <View style={styles.container}>
<Text style={styles.prompt}>{question.prompt}</Text>

<ButtonGroup
 testID="choices"
 buttons={question.choices}
 vertical
onPress={handleSelect}
selectedIndex={!isMulti ? selected : undefined}
selectedIndexes={isMulti ? selected : undefined}
/>

<Button
 title="Next Question"
 testID="next-question"
 onPress={goNext}
disabled={
isMulti ? selected.length === 0 : selected === null
 }
 />
 </View>
  );
}

// export function Summary({ route }) {
export function Summary({ route }) {
  const { data, answers } = route.params;

  let score = 0;

const isCorrect = (q, userAnswer) => {
  if (userAnswer === null || userAnswer === undefined) return false;

  if (Array.isArray(q.correct)) {
    const sortedA = [...q.correct].sort();
    const sortedB = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
    return JSON.stringify(sortedA) === JSON.stringify(sortedB);
  }
  return q.correct === userAnswer;
};

return (
 <ScrollView style={styles.container}>
{data.map((q, i) => {
const correct = isCorrect(q, answers[i]);
if (correct) score++;

return (
<View key={i} style={styles.questionBlock}>
 <Text style={styles.prompt}>
 {q.prompt} ({correct ? "Correct" : "Incorrect"})
</Text>

{q.choices.map((choice, idx) => {
const userAnswer = answers[i];

const isSelected = Array.isArray(userAnswer)
? userAnswer.includes(idx)
: userAnswer === idx;

const isRight = Array.isArray(q.correct)
 ? q.correct.includes(idx)
 : q.correct === idx;

let textStyle = {};

if (isRight) {
  textStyle = styles.correct;
}

return (
<Text key={idx} style={textStyle}>
{choice}
</Text>
);
})}
</View>
 );
})}

<Text testID="total" style={styles.total}>
Score: {score} / {data.length}
</Text>
</ScrollView>
);
}

export default function App() {
  return (
   <NavigationContainer>
   <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Question" component={Question} />
    <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  prompt: {
    fontSize: 18,
    marginBottom: 20,
  },
  questionBlock: {
    marginBottom: 25,
  },
  bold: {
    fontWeight: "bold",
  },
correct: {
  color: "#6a994e",
  fontWeight: "bold", 
},
  total: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
});
