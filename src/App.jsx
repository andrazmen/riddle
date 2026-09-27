import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
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
      "Na poročni dan me vsi želijo, mladoporočencema z željami me podarijo. Ne najdeš me v zlatu ali cvetju, temveč v ljubezni in lepem spominu.",
    answer: "sreča",
    letter: "S",
    revealPositions: [0],
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
    answer: "zaobljuba",
    letter: "U",
    revealPositions: [3],
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
  const [celebrated, setCelebrated] = useState(false);

  const passwordRef = useRef(null);
  const invitationRef = useRef(null);
  const riddleRefs = useRef({});

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

      // premik na naslednjo uganko
      setTimeout(() => {
        const nextRiddle = riddles.find(
          (item) => item.id > riddle.id && !solved[item.id],
        );

        if (nextRiddle) {
          riddleRefs.current[nextRiddle.id]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 600);
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

  const celebrate = () => {
    // 1. skok na geslo
    setTimeout(() => {
      passwordRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);

    // 2. konfeti
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: {
          y: 0.3,
        },
      });
    }, 1000);

    // 3. počasen premik do vabila
    setTimeout(() => {
      invitationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 3000);

    // še en val konfetov pri vabilu
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: {
          y: 0.2,
        },
      });
    }, 4000);
  };

  const highlightLetter = (riddle) => {
    const answer = riddle.answer;
    const index = answer.toLowerCase().indexOf(riddle.letter.toLowerCase());

    if (index === -1) {
      return answer;
    }

    return (
      <>
        {answer.slice(0, index)}
        <strong>{answer[index]}</strong>
        {answer.slice(index + 1)}
      </>
    );
  };

  useEffect(() => {
    if (allSolved && !celebrated) {
      setCelebrated(true);
      celebrate();
    }
  }, [allSolved, celebrated]);

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

        {/* KONČNO GESLO */}
        <section className="password-section" ref={passwordRef}>
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

        {/* POVABILO */}
        {allSolved && (
          <section className="invitation reveal" ref={invitationRef}>
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

        {/* UGANKЕ */}
        <section className="riddles">
          {riddles.map((riddle) => (
            <article
              ref={(el) => (riddleRefs.current[riddle.id] = el)}
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
                      <span>Rešitev</span>

                      <div className="solution">{highlightLetter(riddle)}</div>
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
