import React, { ReactElement, useEffect, useState } from 'react';
import { Container, Segment, Header, Icon, Loader, Button } from 'semantic-ui-react';

import { lower_bound, upper_bound } from './helper';
import { firestore, getIdList } from './firebase';

interface QuestionListProps {
  willUpdate: number;
  setWillUpdate: (x: number) => void;
}

interface Question {
  answer: string;
  content: string;
  isAnswered: boolean;
  timestamp: string;
}

interface QuestionData {
  id: string;
  elem: ReactElement;
}

export default function QuestionList(props: QuestionListProps) {
  const [questionList, setQuestionList] = useState([] as QuestionData[]);
  const [totalLength, setTotalLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const askCollectionRef = firestore.collection("Ask");

  function createQuestionHTML(question: Question, key: string): ReactElement {
    return (
      <Segment vertical key={key}>
        <Header size="medium">
          {question.content}
          <Header sub>{question.timestamp}</Header>
        </Header>
        <p>
          {question.isAnswered
            ? <Icon name="paper plane" />
            : <Icon name="paper plane outline" />
          }
          {question.answer}
        </p>
      </Segment>
    );
  }

  async function updateFront() {
    let idList = await getIdList(askCollectionRef);
    setTotalLength(idList.length);

    let curLength = questionList.length;
    if (!curLength) return;
    let appendTo = upper_bound(idList, questionList[0].id)

    let toAppend: QuestionData[] = [];
    for (let i = appendTo; i < idList.length; i++) {
      let id = idList[i];
      let question = (await askCollectionRef.doc(idList[i]).get()).data() as Question;
      toAppend.push({
        id: id,
        elem: createQuestionHTML(question, id)
      });
    }

    toAppend.reverse();
    setQuestionList(arr => [...toAppend, ...arr]);
  }

  async function updateBack(updateN: number = 5) {
    let idList = await getIdList(askCollectionRef);
    setTotalLength(idList.length);

    let curLength = questionList.length;
    let appendPos = curLength ? lower_bound(idList, questionList[curLength - 1].id) : idList.length;

    let toAppend: QuestionData[] = [];
    for (let i = appendPos - 1; i >= appendPos - updateN; i--) {
      if (i < 0) break;

      let id = idList[i];
      let question = (await askCollectionRef.doc(idList[i]).get()).data() as Question;
      toAppend.push({
        id: id,
        elem: createQuestionHTML(question, id)
      });
    }

    setQuestionList(arr => [...arr, ...toAppend])
  }

  useEffect(() => {
    (async function () {
      if (props.willUpdate) {
        let updateType = props.willUpdate;
        props.setWillUpdate(0);
        if (updateType === 1) await updateFront();
        if (updateType === 2) {
          setLoading(true);
          await updateBack();
          setLoading(false);
        }
      }
    })();
  });

  if (questionList.length) {
    return (
      <Container id="answer_container">
        {questionList.map((questionData) => questionData.elem)}
        <div className="aligner">
          <Button basic disabled={questionList.length === totalLength} loading={loading} onClick={() => { props.setWillUpdate(2); }}>
            {`더 불러오기 (${questionList.length}/${totalLength})`}
          </Button>
        </div>
      </Container>
    );
  } else {
    return (
      <Container id="answer_container">
        <Loader active inline="centered">질문을 가져오고 있어요...</Loader>
      </Container>
    );
  }
}
