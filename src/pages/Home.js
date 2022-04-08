import LangLink from '../components/LangLink'

export default function Home() {
  return (
    <div>
      <h1 className="HomeMinettText text-center mt-4">
        <span
          className="char TextABCMaxiSharpRegular"
          style={{ '--span-index': 0 }}
        >
          M
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 1 }}
        >
          i
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 2 }}
        >
          n
        </span>
        <span
          className="char TextABCMaxiRoundVariable"
          style={{ '--span-index': 3 }}
        >
          e
        </span>
        <span
          className="char TextABCMaxiRoundVariable"
          style={{ '--span-index': 4 }}
        >
          t
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 5 }}
        >
          t
        </span>
        <span
          style={{ '--span-index': 6 }}
          className="char ms-2 TextABCMaxiRoundVariable"
        >
          S
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 7 }}
        >
          t
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 8 }}
        >
          o
        </span>
        <span
          className="char TextABCMaxiRoundVariable"
          style={{ '--span-index': 9 }}
        >
          r
        </span>
        <span
          className="char TextABCMaxiSharpVariable"
          style={{ '--span-index': 10 }}
        >
          i
        </span>
        <span
          className="char TextABCMaxiRoundVariable"
          style={{ '--span-index': 11 }}
        >
          e
        </span>
        <span
          className="char TextABCMaxiRoundVariable"
          style={{ '--span-index': 12 }}
        >
          s
        </span>
      </h1>
      <LangLink to="/stories">S T A R T</LangLink>
    </div>
  )
}
