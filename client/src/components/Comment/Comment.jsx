import moment from "moment";
import { useState } from "react";
import { Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import "./Comment.scss";

export default function Comment({ comment, handleDelete, handleTranslation }) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [language, setLanguage] = useState("Unknown"); // language of the original comment
  const [translation, setTranslation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTranslationToggle() {
    if (isSubmitting) {
      return;
    }

    // get translation only if it's not available
    if (!translation) {
      setIsSubmitting(true);

      const { language, translation: translatedText } = await handleTranslation(comment.id);
      setLanguage(language);
      setTranslation(translatedText ? translatedText : comment.body); // set original text as 'translation' if translation was unsucessfull

      setIsSubmitting(false);
    }

    setIsTranslated(!isTranslated);
  }

  function getTranslateButtonText() {
    if (isSubmitting) {
      return "translating...";
    }

    return isTranslated ? `see original (${language})` : "see tranlsation";
  }

  return (
    <div className="comment">
      {handleDelete && (
        <button className="comment__delete-btn" onClick={() => handleDelete(comment.id)} title="Delete Comment">
          <Trash2 color="var(--red)" />
        </button>
      )}
      <div className="comment__author">
        <Link to={`/users/${comment.user.id}`}>
          <img src={comment.user.avatarUrl} alt="Avatar" className="avatar" />
        </Link>
        <div>
          <Link to={`/users/${comment.user.id}`}>{comment.user.name}</Link>
          <br />
          <small>{moment(comment.date).format("MMM Do YYYY, h:mm a")}</small>
        </div>
      </div>
      <div className="comment__body">{isTranslated && translation ? translation : comment.body}</div>
      <div className="comment__footer">
        <span className="comment__footer__translation-toggle" onClick={handleTranslationToggle}>
          {getTranslateButtonText()}
        </span>
      </div>
    </div>
  );
}
