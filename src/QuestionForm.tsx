import React, { ChangeEvent, useState } from 'react';
import { Container, Form, TextArea, Message, Button, Icon, Loader } from 'semantic-ui-react';
import { firestore } from './firebase';
import moment from 'moment';
import 'moment/locale/ko';

export default function QuestionForm() {
  const lengthLimit: number = 140;
  const [text, setText] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  function onSubmit() {
    let submit_data = text.replace(/^\s+/, '').replace(/\s+$/, '');

    if (submit_data === '' || text.length > 140) {
      setError(true);
      return;
    }

    setLoading(true);

    let now = moment.now();
    firestore.collection("Ask").doc(now.toString()).set({
      content: submit_data,
      answer: "아직 답변되지 않았어요 ㅠㅠ...",
      isAnswered: false,
      timestamp: moment(now).locale("ko").format("lll")
    }).then(function () {
      setText("");
      setSuccess(true);
      setLoading(false);
    }).catch(function (error) {
      console.error(error);
    });
  }

  return (
    <Container>
      <Form id="question_form" success={success} error={error}>
        <Form.Field error={text.length > lengthLimit} control={TextArea} rows="7" placeholder="질문을 남기세요!" value={text} onChange={onTextChange} />
        <Message success header="질문 완료" content="질문 제출이 성공적으로 완료되었어요!" />
        <Message error header="질문 제출 실패" content="질문 내용은 공백이거나, 140자를 넘길 수 없습니다." />
        <Button disabled={text.length > lengthLimit} basic fluid onClick={onSubmit}>
          {!loading && <Icon name="paper plane" />}
          {!loading && ` 질문 제출하기 (${text.length}/140자)`}
          {loading && <Loader active inline="centered" size="tiny" />}
        </Button>
      </Form>
    </Container>
  );
}
