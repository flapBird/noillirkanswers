export const guides = {
  "how-to-play": {
    title: "How to play Noillirk",
    description:
      "Play the seven-round PlayDaily climb, read your score and find out when the next Daily begins.",
    html: `
      <h2>Your daily climb</h2>
      <p>Choose Daily on PlayDaily. Everyone gets the same seven prompts and one attempt until the board changes at midnight UTC. If you leave mid-climb, use Resume ascent to continue.</p>
      <p>Read the prompt during the countdown. You then have 25 seconds to type the answer you think most people would give. Your first accepted answer ends the round. If the game rejects a guess, you can try again while time remains.</p>
      <h2>What your score means</h2>
      <table><thead><tr><th scope="col">Tier</th><th scope="col">Points</th><th scope="col">Board position</th></tr></thead><tbody>
      <tr><td>Sky High</td><td>100</td><td>First place</td></tr>
      <tr><td>Jet Stream</td><td>64</td><td>Second through fourth</td></tr>
      <tr><td>Cloud Nine</td><td>32</td><td>Fifth through ninth</td></tr>
      <tr><td>Kite</td><td>16</td><td>Less common</td></tr>
      <tr><td>Treetop</td><td>8</td><td>Rarer</td></tr>
      <tr><td>Grounded</td><td>4</td><td>Rarest accepted tier</td></tr>
      </tbody></table>
      <p>A pass or an expired clock with no accepted answer earns zero. Seven first-place answers earn 700 points. Two different answers can earn 64 points on the same prompt because that tier covers three positions.</p>
      <p><a href="https://playdaily.org/noillirk">Play the official Noillirk Daily and read the rules</a></p>
      <p><a href="/">Check the daily sheet</a> · <a href="/hints/">Try the hint guide</a></p>`,
  },
  hints: {
    title: "Noillirk hints",
    description:
      "Get a nudge on a tricky round and keep the rest of your Noillirk climb spoiler-free.",
    html: `
      <h2>Open one clue at a time</h2>
      <ol><li>Find your question on the answer sheet. Check the UTC date and the wording before opening a clue.</li>
      <li>Choose <strong>Hint</strong> for a direction to think in. If you have a guess, pause here.</li>
      <li>Open <strong>First letter &amp; length</strong> to check the shape of the suggested answer. Spaces and punctuation do not count toward its letter total.</li>
      <li>Choose <strong>Reveal answer</strong> when you want the word. Every other round stays hidden.</li></ol>
      <h2>Try a practice clue</h2>
      <p><strong>Name something you put on before going out in the rain.</strong> Picture someone stepping out onto a wet pavement. Which item could they wear?</p>
      <details><summary>First letter &amp; length</summary><p>Starts with R and has eight letters.</p></details>
      <details><summary>Reveal practice answer</summary><p><strong>Raincoat.</strong> An umbrella comes to mind too, but the words “put on” point to clothing. This is an original practice example.</p></details>
      <h2>When two guesses both fit</h2>
      <p>Say each one out loud. Which word might a stranger use without an explanation? A short, everyday name is a good first candidate. Check the qualifiers once more before submitting.</p>
      <p><a href="/">Find your round</a> · <a href="/archive/">Browse the archive</a> · <a href="https://playdaily.org/noillirk">PlayDaily’s game guide</a></p>`,
  },
  "krillion-vs-noillirk": {
    title: "Krillion vs Noillirk",
    description:
      "See how the same kind of prompt rewards different guesses in Krillion and Noillirk.",
    html: `
      <h2>Which answer earns the points?</h2>
      <p>Noillirk sends your krill skyward when you match a popular answer. In Krillion, a rare answer sends your krill deeper. Read “Krillion” backwards and you get the name of the climb.</p>
      <h2>One prompt, two strategies</h2>
      <p>Try this practice prompt: <strong>Name a musical instrument with strings.</strong></p>
      <p><strong>Playing Noillirk?</strong> A guitar is a reasonable first guess. You might expect people who have never played an instrument to name one straight away.</p>
      <p><strong>Playing Krillion?</strong> Consider a dulcimer. It fits the same category, and fewer people might think of it under time pressure. These examples illustrate the choice without assigning either word a score.</p>
      <h2>Finding the right sheet</h2>
      <p>This site covers the seven-round Noillirk Daily at PlayDaily. When checking an answer, match the game, UTC date and prompt. A high-scoring pick from another edition may belong to a different question board.</p>
      <p><a href="https://playdaily.org/resources/stories/krillion-vs-noillirk">Read PlayDaily’s comparison</a> · <a href="/how-to-play/">See the Noillirk scoring tiers</a></p>`,
  },
};
