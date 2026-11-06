import { FormEvent, KeyboardEvent, useMemo, useState } from "react";

const portraitUrl = "/profile.jpeg";

const CV_URL = "/cv.pdf";
const EMAIL_ADDRESS = "rohanamudhala@gmail.com";

type CommandId = "email" | "github" | "linkedin" | "cv" | "theme";

type TerminalCommand = {
  id: CommandId;
  description: string;
};

const terminalCommands: TerminalCommand[] = [
  { id: "email", description: `Write to ${EMAIL_ADDRESS}` },
  { id: "github", description: "Open github.com/nodonut6311" },
  { id: "linkedin", description: "Open linkedin.com/in/rohan-amudhala-b70000325" },
  { id: "cv", description: "Open rohan's cv" },
  { id: "theme", description: "Switch to light mode" },
];

function PixelTitle() {
  return (
    <div className="pixel-title" aria-label="Rohan Amudhala">
      <span>ROHAN</span>
      <span>AMUDHALA</span>
    </div>
  );
}

export default function App() {
  const [message, setMessage] = useState("");
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [unknownCommand, setUnknownCommand] = useState("");

  const filteredCommands = useMemo(() => {
    if (!message.startsWith("/")) return [];

    const query = message.slice(1).toLowerCase();
    return terminalCommands
      .map((command) =>
        command.id === "theme"
          ? {
              ...command,
              description: isLightTheme ? "Switch to dark mode" : "Switch to light mode",
            }
          : command,
      )
      .filter((command) => command.id.startsWith(query));
  }, [isLightTheme, message]);

  const commandMenuVisible = message.startsWith("/");

  function runCommand(command: TerminalCommand) {
    if (command.id === "theme") {
      setIsLightTheme((currentTheme) => !currentTheme);
    } else {
      const urls: Record<Exclude<CommandId, "theme">, string> = {
        email: `mailto:${EMAIL_ADDRESS}`,
        github: "https://github.com/nodonut6311",
        linkedin: "https://www.linkedin.com/in/rohan-amudhala-b70000325/",
        cv: CV_URL,
      };
      window.open(urls[command.id], "_blank", "noopener,noreferrer");
    }

    setMessage("");
    setHighlightedIndex(0);
    setUnknownCommand("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.startsWith("/")) {
      if (message.trim()) {
        window.open(
          `mailto:${EMAIL_ADDRESS}?body=${encodeURIComponent(message.trim())}`,
          "_blank",
          "noopener,noreferrer",
        );
      }
      setMessage("");
      return;
    }

    const exactMatch = filteredCommands.find((command) => `/${command.id}` === message);
    const selectedCommand = exactMatch ?? filteredCommands[highlightedIndex];

    if (selectedCommand) {
      runCommand(selectedCommand);
      return;
    }

    setUnknownCommand(`Unknown command: ${message}`);
    setMessage("");
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!commandMenuVisible) return;

    if (event.key === "Escape") {
      event.preventDefault();
      setMessage("");
      setHighlightedIndex(0);
      return;
    }

    if (!filteredCommands.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) => (index + 1) % filteredCommands.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex(
        (index) => (index - 1 + filteredCommands.length) % filteredCommands.length,
      );
    }
  }

  return (
    <main className={`terminal-window${isLightTheme ? " light-theme" : ""}`}>
      <header className="terminal-bar">
        <div className="window-controls" aria-hidden="true">
          <span className="control close" />
          <span className="control minimize" />
          <span className="control maximize" />
        </div>
        <p>~/roamd — zsh</p>
      </header>

      <section className="content-shell">
        <fieldset className="intro-panel">
          <legend>— roamd.com v2026.11 —</legend>
          <div className="profile-wrap">
            <div className="profile-photo">
              <img src={portraitUrl} alt="Portrait of Rohan Amudhala" />
              <span className="photo-mark">⌁</span>
            </div>
          </div>

          <div className="intro-content">
            <PixelTitle />
            <p className="tagline">
              <strong>Turning messy problems into clear answers</strong>{" "}
              <span> data · automation · backend systems </span>
            </p>

            <div className="panel-rule" />
            <div className="details-grid">
              <div className="tips-section">
                <h2>Tips for getting started</h2>
                <div className="tips-list">
                  <div className="tip-row">
                    <span className="tip-number">1.</span>
                    <span className="tip-text">
                      Type <span className="tip-accent">/</span> for commands, e.g.{" "}
                      <span className="tip-accent">/theme</span>
                    </span>
                  </div>
                  <div className="tip-row">
                    <span className="tip-number">2.</span>
                    <span className="tip-text">Or type a note and hit Enter to email me</span>
                  </div>
                </div>
              </div>
              <div className="elsewhere">
                <h2>Elsewhere</h2>
                <dl>
                  <div>
                    <dt>email</dt>
                    <dd>
                      <a href={`mailto:${EMAIL_ADDRESS}`}>{EMAIL_ADDRESS}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>github</dt>
                    <dd>
                      <a href="https://github.com/nodonut6311" target="_blank" rel="noopener noreferrer">
                      github.com/nodonut6311 
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>linkedin</dt>
                    <dd>
                      <a href="https://www.linkedin.com/in/rohan-amudhala-b70000325/" target="_blank" rel="noopener noreferrer">
                        linkedin.com/in/rohan-amudhala-b70000325
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>cv</dt>
                    <dd>
                    <a href={CV_URL} target="_blank" rel="noopener noreferrer">
                      cv.pdf
                    </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </fieldset>

        <section className="terminal-copy" aria-label="About Rohan">
          <p className="command">&gt; who is rohan?</p>
          <div className="read-command">
            <span className="status-dot" />
            <div>
              <p>
                <b>Read</b>(about.md)
              </p>
              <p className="muted branch">└ Read 6 paragraphs</p>
            </div>
          </div>

          <div className="about-copy">
          <p>
            <span className="bullet">●</span>19, mumbai | chennai
          </p>
          <p>
            most of my work sits between engineering and data, so i'm often the one
            who makes a technical result make sense to the people who need it.
          </p>
          <p>
            i've built pipelines that takes messy, manual work and makes it simple
            enough for anyone to use. 
          </p>
          <p>
            interested in solving real life pain points with software {"("}shipped an AI voice assistant that helps people complete government services in 23
            languages{")"}.
          </p>
          <p>
            i love storytelling, i've curated short-form social content, scripts, and community-led narratives across 4 college clubs, 
            driving stronger community connection. 
          </p>
          <p>
            rn i'm focused on building practical tools that help cross-functional teams handle everyday problems
            with less friction and better information.
          </p>
          </div>

          {unknownCommand && <p className="unknown-command">{unknownCommand}</p>}
          {commandMenuVisible && (
            <div className="command-menu" role="listbox" aria-label="Terminal commands">
              {filteredCommands.map((command, index) => (
                <button
                  className={
                    index === highlightedIndex
                      ? "command-menu-row is-highlighted"
                      : "command-menu-row"
                  }
                  key={command.id}
                  onClick={() => runCommand(command)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  type="button"
                >
                  <span>/{command.id}</span>
                  <span>{command.description}</span>
                </button>
              ))}
              {!filteredCommands.length && (
                <p className="command-menu-empty">No matching commands</p>
              )}
            </div>
          )}
          <form className="terminal-input" onSubmit={handleSubmit}>
            <span>&gt;</span>
            <span className="cursor" aria-hidden="true" />
            <input
              aria-label="Type a message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setHighlightedIndex(0);
                setUnknownCommand("");
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Type / or a message"
            />
          </form>
          <footer className="terminal-footer">
            <span style={{ color: "var(--orange)" }}>+ Go on, send an email.</span>
            <span>/ for commands · © 2026 Rohan Amudhala</span>
          </footer>
        </section>
      </section>
    </main>
  );
}
