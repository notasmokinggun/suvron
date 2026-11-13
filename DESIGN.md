# Design: SUVRON Money (painted rate board)

The site is a hand-painted Indian shop sign. The loan's terms are painted plainly on enamel boards, the way a trusted local shop paints its rate list.

## Tokens
| Token | Value | Use |
|---|---|---|
| `--p-bg` | #f4f6fb | Page ground (cool white) |
| `--p-ink` | #0d1a3a | Text, phone bezels |
| `--p-muted` | #4b5672 | Labels and meta only |
| `--enamel` / `--p-inv-bg` | #1e51b8 | Sign boards, rate band (the logo blue) |
| `--enamel-deep` | #0b2a61 | Painted shadow line under marigold numerals |
| `--marigold` / `--p-action` | #f7931e | The one action colour; painted numerals on enamel |
| `--marigold-deep` | #c2620a | Button edge, icons on white boards |
| `--board` | #ffffff | White enamel panels (rate list, referral ticket) |

## Type
- Display: Bricolage Grotesque 700, tracking -0.025em to -0.035em: a confident fintech grotesk with a little character. Used for h1–h3, painted words and board titles; figures stay in Manrope. Self-hosted latin, plus latin-ext for ₹. Indic headlines fall back to the Noto families.
- Text: Manrope variable, 400 and 500. Used for body, UI mocks and labels.
- h1 is up to 64px; h2 48px at 1440 (36px at 1024–1279); every h3 is 20px.

## Components
- `.board`: flat enamel with a 2px white pinstripe painted 10px inside the edge, and a 6px radius. `.board--white` is the white enamel version with a blue pinstripe. `.bolts` adds four bolt heads.
- `.paint`: marigold numerals with a .045em painted shadow line in `--enamel-deep`. `.paint--blue` is for white boards and uses blue with a marigold shadow.
- Phone mocks are one box: a white screen with a 10px navy bezel, cut by the board's bottom edge.
- Buttons: the kit's `tonal` look. The primary is marigold with navy text and a `--marigold-deep` edge.

## Rules
- One section per screen. Equal 80px gutters on a 12-column grid (taste-skill system).
- Splits run text left, board right, at 6/6 on the column 7 line.
- No gradients, glows or mesh grounds. Every board is flat enamel.
- Orange is reserved for the action and for painted numerals on enamel.
- Motion: the kit hover layer, plus one card loop in the hero (desktop only).
