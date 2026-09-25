import { useState } from "react";
import "./App.css";

const riddles = [
  {
    id: 1,
    question:
      "Nimam ust, pa govorim z zvonom. Nimam nog, pa ljudje prihajajo k meni. Nimam srca, pa mnogim veliko pomeni.",
    answer: "cerkev",
    letter: "V",
    revealPositions: [1],
  },
  {
    id: 2,
    question:
      "Ne potrebujem besed, da se pokažem. Ne potrebujem darila, da jo začutim. Lahko boli, lahko zdravi, a brez mene je svet precej bolj prazen.",
    answer: "ljubezen",
    letter: "U",
    revealPositions: [3],
  },
  {
    id: 3,
    question:
      "Vedno je pred tabo, a nikoli je ne moreš dohiteti. Ko pride, že ni več to, kar je bila.",
    answer: "prihodnost",
    letter: "H",
    revealPositions: [5],
  },
  {
    id: 4,
    question:
      "Nimam vezi, pa dva povežem. Nimam rok, pa zavežem za vse življenje. Izrečena sem z besedami, a moja teža se meri z dejanji.",
    answer: "prisega",
    letter: "S",
    revealPositions: [0],
  },
  {
    id: 5,
    question:
      "Krog sem, a nisem kovanec. Nosim se, a nisem obleka. Nimam jezika, pa lahko povem, komu pripadam.",
    answer: "prstan",
    letter: "R",
    revealPositions: [4],
  },
];

// Končno geslo brez presledka.
// Presledek je samo vizualni separator.
const password = "SV.URH";

function App() {
  const [answers, setAnswers] = useState({});
  const [solved, setSolved] = useState({});
  const [error, setError] = useState({});

  const handleSubmit = (riddle) => {
    const userAnswer = (answers[riddle.id] || "").trim().toLowerCase();

    if (userAnswer === riddle.answer.toLowerCase()) {
      setSolved((prev) => ({
        ...prev,
        [riddle.id]: true,
      }));

      setError((prev) => ({
        ...prev,
        [riddle.id]: false,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        [riddle.id]: true,
      }));
    }
  };

  const isPositionRevealed = (position) => {
    return riddles.some(
      (riddle) =>
        solved[riddle.id] && riddle.revealPositions.includes(position),
    );
  };

  const allSolved = riddles.every((riddle) => solved[riddle.id]);

  return (
    <main className="page">
      <div className="container">
        {/* HEADER */}
        <header className="hero">
          <div className="eyebrow">5 UGANK • 1 GESLO</div>

          <h1>
            Melanja<span> in </span>Andraž
          </h1>

          <div className="eyebrow">2. DEL</div>

          <p>Reši vseh pet ugank in razkrij presenečenje!</p>
        </header>

        {/* POVABILO */}
        {allSolved && (
          <section className="invitation">
            <div className="invitation-icon">✦</div>

            <div className="eyebrow">ČESTITAVA!</div>

            <h2>
              Razkril si geslo in si prislužil vabilo na najino cerkveno poroko!
            </h2>

            <p>
              Upava, da se vidimo!
              <br />
            </p>

            <div className="event-card">
              <div>
                <span>DATUM</span>
                <strong>10. 10. 2026</strong>
              </div>

              <div>
                <span>URA</span>
                <strong>11:00</strong>
              </div>

              <div>
                <span>LOKACIJA</span>
                <strong>Cerkev sv. Urha na Tinju</strong>
              </div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2182.741427974242!2d15.504205684250197!3d46.42725979579396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476f81fb080434c5%3A0x2a2f92faef87718a!2sSveti%20Urh!5e0!3m2!1ssl!2ssi!4v1790363299323!5m2!1ssl!2ssi"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokacija dogodka"
              ></iframe>
            </div>
          </section>
        )}

        {/* KONČNO GESLO */}
        <section className="password-section">
          <div className="password-label">KONČNO GESLO</div>

          <div className="password">
            {password.split("").map((character, index) => {
              // Pika je vedno vidna.
              if (character === ".") {
                return (
                  <span className="password-character punctuation" key={index}>
                    .
                  </span>
                );
              }

              const revealed = isPositionRevealed(index);

              return (
                <span
                  className={`password-character ${revealed ? "revealed" : ""}`}
                  key={index}
                >
                  {revealed ? character : "_"}
                </span>
              );
            })}
          </div>

          <div className="password-spacer">
            {/* Samo vizualni presledek med SV. in URH */}
          </div>

          <p>
            {allSolved
              ? "Vse uganke so rešene."
              : `Rešenih ugank: ${
                  Object.keys(solved).length
                } / ${riddles.length}`}
          </p>
        </section>

        {/* UGANKЕ */}
        <section className="riddles">
          {riddles.map((riddle) => (
            <article
              className={`riddle ${solved[riddle.id] ? "solved" : ""}`}
              key={riddle.id}
            >
              <div className="riddle-number">0{riddle.id}</div>

              <div className="riddle-content">
                <div className="riddle-status">
                  {solved[riddle.id] ? "✓ REŠENO" : "UGANKA"}
                </div>

                <h2>{riddle.question}</h2>

                {!solved[riddle.id] ? (
                  <>
                    <div className="answer-row">
                      <input
                        type="text"
                        placeholder="Tvoj odgovor..."
                        value={answers[riddle.id] || ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [riddle.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSubmit(riddle);
                          }
                        }}
                      />

                      <button onClick={() => handleSubmit(riddle)}>
                        Preveri
                      </button>
                    </div>

                    {error[riddle.id] && (
                      <div className="error">Hmm ... poskusi še enkrat.</div>
                    )}
                  </>
                ) : (
                  <div className="revealed-letter">
                    <div>
                      <span>Pridobljena črka</span>
                      <strong>{riddle.letter}</strong>
                    </div>

                    <div className="success">✓</div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default App;
