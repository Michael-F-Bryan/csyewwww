import { Advice } from "../gpt";
import ReactMarkdown from 'react-markdown';

interface Props {
    advice: Advice;
    onClose: () => void;
}

export default function Modal({ advice, onClose }: Props) {
    return (
        <div className="modal display-block">
            <section className="modal-main">
                <h2 style={{ textAlign: "center" }}>{advice.Title}</h2>
                <p style={{ textAlign: "center" }}>
                    <strong >{advice.ShortDescription}</strong>
                </p>

                <ReactMarkdown>{advice.TimeSensitiveInformation}</ReactMarkdown>

                <button type="button" onClick={() => onClose()}>
                    Close
                </button>
            </section>
        </div>
    );
}
