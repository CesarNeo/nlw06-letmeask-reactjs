import { useParams, useHistory } from 'react-router-dom';
import { BiMoon, BiSun } from 'react-icons/bi';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoWhiteImg from '../assets//images/Logo-white.svg';

import { database } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from '../hooks/useTheme';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);
    const { theme, toogleTheme } = useTheme();

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(
            `rooms/${roomId}/questions/${questionId}`
        ).update({
            isAnswered: true,
        });
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(
            `rooms/${roomId}/questions/${questionId}`
        ).update({
            isHighLighted: true,
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir está pergunta?')) {
            await database.ref(
                `rooms/${roomId}/questions/${questionId}`
            ).remove();
        }
    }

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });

        history.push('/');
    }

    return (
        <div id="page-room" className={theme}>
            <header>
                <div className="content">
                    <img src={theme === 'light' ? logoImg : logoWhiteImg} alt="Letmeask" />
                    <div>
                        <button type="button" onClick={toogleTheme}>
                            {theme === 'light' ? <BiMoon size={25} /> : <BiSun size={25} />}
                        </button>

                        <RoomCode code={roomId} />

                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => (
                        <Question
                            content={question.content}
                            author={question.author}
                            key={question.id}
                            isAnswered={question.isAnswered}
                            isHighLighted={question.isHighLighted}
                        >
                            {!question.isAnswered && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                    >
                                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleHighLightQuestion(question.id)}
                                    >
                                        <img src={answerImg} alt="Dar destaque à pergunta" />
                                    </button>
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="Remover pergunta" />
                            </button>
                        </Question>
                    ))}
                </div>
            </main>
        </div>
    );
}