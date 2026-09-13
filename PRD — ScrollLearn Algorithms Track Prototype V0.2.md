# ScrollLearn — Design & Analysis of Algorithms
## Detailed Prototype PRD — V0.2

**Product:** ScrollLearn  
**Prototype Track:** Design & Analysis of Algorithms  
**Version:** V0.2  
**Platform:** Responsive Web App / PWA  
**Prototype Objective:** Validate whether difficult algorithmic concepts can be learned through a modern, swipe-first, visually rich, interactive experience.

---

# 1. Prototype Objective

This prototype is not intended to represent the complete Algorithms course.

Its purpose is to prove the central product hypothesis:

> **A learner can understand serious algorithmic concepts through short, visually compelling, interactive learning cards without experiencing the product as a conventional course or lecture.**

The prototype will therefore prioritize:

1. UX quality
2. Attention retention
3. Visual storytelling
4. Animation quality
5. Interaction quality
6. Conceptual clarity
7. Learning effectiveness
8. Technical extensibility

The prototype should feel like a **premium interactive product**, not an animated textbook.

---

# 2. Track

## Design and Analysis of Algorithms

The complete planned curriculum is:

```text
Design & Analysis of Algorithms
│
├── 01. Algorithms & Computing
│   ├── What are Algorithms?
│   ├── Algorithms as Technology
│   ├── Evolution of Algorithms
│   ├── Design of Algorithms
│   ├── Need for Correctness
│   ├── Confirming Correctness
│   └── Iterative Algorithm Design Issues
│
├── 02. Problem Solving Principles
│   ├── Classification of Problems
│   ├── Problem Solving Strategies
│   └── Time Complexity Classes
│
├── 03. Algorithm Analysis
│   ├── Input Size
│   ├── Best Case
│   ├── Worst Case
│   ├── Average Case
│   ├── Dominant Operators
│   ├── Growth Rate
│   └── Upper Bounds
│
├── 04. Asymptotic Analysis
│   ├── O
│   ├── Ω
│   ├── Θ
│   ├── o
│   └── ω
│
├── 05. Computational Complexity
│   ├── Polynomial Problems
│   ├── Non-Polynomial Problems
│   ├── Deterministic Algorithms
│   ├── Non-Deterministic Algorithms
│   ├── P-Class
│   └── NP-Class
│
└── 06. NP Complexity
    ├── Polynomial Reduction
    ├── Vertex Cover
    ├── 3-SAT
    └── Hamiltonian Cycle
```

Only a carefully selected subset will be implemented in V0.2.

---

# 3. Prototype Scope

The prototype consists of four flagship experiences:

## Experience A — Complexity Race

Concepts:

- Constant
- Logarithmic
- Linear
- Linearithmic
- Quadratic
- Exponential
- Growth rate

## Experience B — Algorithm Execution

Concepts:

- Input size
- Algorithm steps
- Iteration
- Dominant operation
- Best/worst case
- Execution trace

## Experience C — Break the Algorithm

Concepts:

- Correctness
- Counterexamples
- Best case
- Worst case
- Algorithm failure

## Experience D — Graph Puzzle

Concepts:

- Graph representation
- Vertex Cover
- Hamiltonian Cycle

These experiences collectively demonstrate the core interaction primitives required by the eventual platform.

---

# 4. Product Experience Principles

## 4.1 Learning should feel like exploration

The learner should feel:

> “What happens if I do this?”

rather than:

> “I need to read this explanation.”

---

## 4.2 Every visual should communicate something

No animation exists merely for decoration.

Motion should represent:

- Execution
- Change
- Cause and effect
- Scale
- Comparison
- Relationship
- State
- Transformation

---

## 4.3 Every major concept should have a mental image

Examples:

| Concept | Mental representation |
|---|---|
| Algorithm | Step-by-step transformation |
| Iteration | State repeatedly changing |
| Input size | Growing problem |
| O(n) | Straight growth |
| O(n²) | Accelerating curve |
| Exponential | Explosive growth |
| Correctness | Algorithm survives every valid input |
| Counterexample | Input that breaks the algorithm |
| Vertex Cover | Nodes covering every edge |
| Hamiltonian Cycle | One continuous route visiting every vertex |

---

# 5. UX North Star

Every card should pass five questions:

### 1. Is the main idea visible immediately?

### 2. Does the card create curiosity?

### 3. Is there a meaningful interaction or visual event?

### 4. Can the learner understand the concept without a long paragraph?

### 5. Does the card create a reason to continue?

If a card fails multiple criteria, it should be redesigned.

---

# 6. Core Feed Architecture

The learner enters:

```text
Track
 ↓
Experience
 ↓
Card Feed
```

The feed is vertical and full-screen.

Each card represents a conceptual beat.

Example:

```text
Question
 ↓
Prediction
 ↓
Visual event
 ↓
Explanation
 ↓
Interaction
 ↓
Concept compression
 ↓
Challenge
 ↓
Next concept
```

The feed should not expose conventional chapter navigation during the primary experience.

---

# 7. Feed Interaction

## Primary Interaction

Vertical swipe.

## Secondary Interactions

Depending on card type:

- Tap
- Drag
- Hold
- Scrub
- Select
- Draw
- Toggle
- Slider
- Reorder
- Zoom

The learner should understand the interaction from the visual itself wherever possible.

---

# 8. Card Design System

The prototype introduces a reusable card engine.

```text
CardRenderer
│
├── HookCard
├── ConceptCard
├── PredictionCard
├── RevealCard
├── AnimationCard
├── ExecutionCard
├── ChallengeCard
├── GraphCard
├── ComparisonCard
├── EquationCard
└── SummaryCard
```

Cards should not be manually implemented as unrelated pages.

---

# 9. Card Schema

Conceptually:

```json
{
  "id": "complexity-race-01",
  "concept": "growth-rate",
  "type": "prediction",
  "objective": "Understand why growth rate dominates as input size increases",
  "hook": "Which algorithm survives the largest input?",
  "interaction": {
    "type": "choice",
    "options": ["log n", "n", "n²"]
  },
  "visual": {
    "type": "growth-race",
    "animation": "accelerating-curves"
  },
  "difficulty": 2,
  "prerequisites": [],
  "next": [
    "complexity-scale-02"
  ]
}
```

The frontend renderer interprets the specification.

---

# 10. Visual Design Direction

The visual language should combine:

- Editorial typography
- Interactive data visualization
- Scientific visualization
- Modern developer-tool aesthetics
- High-quality motion
- Minimal interface chrome

The design should feel:

**technical + premium + immersive + modern**

and not:

**academic + cluttered + presentation-like.**

---

# 11. Screen Composition

A typical card:

```text
┌────────────────────────────────┐
│ Algorithms       03 / 12       │
│                                │
│                                │
│       MAIN VISUAL              │
│                                │
│                                │
│                                │
│     One short explanation      │
│                                │
│                                │
│           ↑ swipe              │
└────────────────────────────────┘
```

UI controls remain secondary.

Content owns the viewport.

---

# 12. Typography

Hierarchy:

### Level 1
Large conceptual question.

Example:

> **Which algorithm wins when the input becomes enormous?**

### Level 2
One-sentence explanation.

### Level 3
Technical notation or metadata.

Avoid paragraphs wherever possible.

---

# 13. Animation System

Animation primitives required for this prototype:

```text
GrowthCurve
Race
NodeGraph
EdgeHighlight
PathDraw
Array
Pointer
Counter
StateTransition
CodeTrace
ScaleTransform
SearchSpace
Matrix
Timeline
```

These should be designed for reuse.

---

# 14. Animation Behavior

Animations should generally use:

```text
Anticipation
    ↓
Action
    ↓
Transformation
    ↓
Explanation
    ↓
Resting State
```

Example:

A curve begins growing.

The user sees the gap increase.

The animation pauses.

Then:

> **This is why growth rate matters.**

---

# 15. Performance Requirements

The visual experience depends heavily on animation quality.

Target:

- 60 FPS on capable devices
- Minimal layout shifts
- No blocking transitions
- Lazy-loading of heavy visual assets
- Prefetching next cards
- Smooth touch response
- Avoid unnecessary rerenders

Animation must remain smooth even when the learner rapidly swipes.

---

# 16. EXPERIENCE A — COMPLEXITY RACE

## Objective

Make algorithmic growth visually intuitive **before introducing formal asymptotic notation.**

---

## A1 — Curiosity Hook

Screen:

> **Which algorithm survives when the input gets huge?**

Three abstract runners appear:

```text
log n
n
n²
```

No definitions yet.

---

## A2 — Small Input

Input control:

```text
n = 10
```

The algorithms execute.

The visual differences are relatively small.

Prompt:

> **They look almost similar.**

> **What happens when n grows?**

---

## A3 — Scale-Up

Slider:

```text
n = 100
```

The race executes again.

`n²` begins to fall behind.

---

## A4 — Large Scale

```text
n = 10,000
```

The race becomes dramatically different.

The quadratic curve accelerates.

---

## A5 — Exponential Reveal

Introduce:

```text
2ⁿ
```

The screen progressively zooms outward as the number of operations explodes.

The user sees the curve leave the visual frame.

---

## A6 — Complexity Universe

Display:

```text
O(1)
O(log n)
O(n)
O(n log n)
O(n²)
O(2ⁿ)
O(n!)
```

Animated curves establish relative growth.

---

## A7 — Drag-to-Rank

The learner receives cards:

```text
log n
n
n log n
n²
2ⁿ
n!
```

and must drag them into increasing growth order.

---

## A8 — Challenge

> **Which one would you choose for a billion-item dataset?**

The user predicts.

Then the system reveals the practical implication.

---

## A9 — Concept Compression

Minimal card:

> **Complexity describes how algorithmic work grows as the input grows.**

Visual remains active behind the statement.

---

## A10 — Transition

> **Now let's see where that work actually comes from.**

Transition into Algorithm Execution.

---

# 17. EXPERIENCE B — ALGORITHM EXECUTION

## Objective

Teach the learner to see an algorithm as an evolving sequence of operations.

---

# B1 — Input

Display:

```text
[7] [2] [9] [4] [1]
```

Prompt:

> **Find the largest number.**

---

# B2 — Prediction

Options:

- Sort first
- Compare while scanning
- Check every pair

---

# B3 — Execution

Set:

```text
max = 7
```

Then animate:

```text
7 vs 2 → 7
7 vs 9 → 9
9 vs 4 → 9
9 vs 1 → 9
```

---

# B4 — State Visualization

The screen tracks:

```text
i = 0
max = 7
comparisons = 1
```

As the algorithm advances:

```text
i = 1
max = 7
comparisons = 2
```

State changes should be animated.

---

# B5 — Input Size

User increases the array:

```text
5 → 10 → 100 → 1,000
```

The number of operations grows.

---

# B6 — Dominant Operation

Ask:

> **What are we really counting?**

Highlight:

```text
comparison
```

The comparison operation pulses.

---

# B7 — Complexity

Reveal:

> **One pass through n elements → approximately n comparisons.**

Then introduce:

**O(n)**

---

# B8 — Best Case

Use linear search.

Target appears first.

```text
[ target ][ ... ][ ... ][ ... ]
     ↑
   FOUND
```

---

# B9 — Worst Case

Target appears last.

The entire array is scanned.

---

# B10 — Average Case

Several random target positions are sampled.

The visual displays the average behavior.

---

# B11 — Run It

The user can supply an array.

The algorithm executes against the user's data.

---

# 18. EXPERIENCE C — BREAK THE ALGORITHM

## Objective

Teach correctness through **failure discovery** rather than formal proof first.

---

# C1 — Challenge

> **I wrote an algorithm.**

> **Can you break it?**

This creates immediate curiosity.

---

# C2 — Flawed Algorithm

Show a simple algorithm with an intentional logical flaw.

Example:

```text
Find maximum
→ start with first element
→ compare selected values
→ update maximum
```

Visual execution demonstrates normal success.

---

# C3 — Counterexample Hunt

Provide several inputs.

The user selects an input that makes the algorithm fail.

Correct selection triggers:

> **You broke it.**

Not negative language—celebrate successful discovery.

---

# C4 — Why It Failed

Replay the execution.

Highlight the exact state where the algorithm makes the wrong assumption.

---

# C5 — Universal Requirement

Introduce:

> An algorithm must work for **every valid input**, not merely the examples we tested.

---

# C6 — Corrected Algorithm

Run the repaired algorithm against the same counterexample.

The failure disappears.

---

# C7 — Correctness Concept

Introduce:

> **Testing can reveal a bug.  
> It cannot prove that no bug exists.**

This is a strong conceptual anchor.

---

# C8 — Proof Transition

Transition toward formal correctness methods.

The interface can show:

```text
Counterexample
     ↓
Why it fails
     ↓
Invariant / reasoning
     ↓
Correctness
```

Formal proof content comes later in the full track.

---

# 19. EXPERIENCE D — GRAPH PUZZLE

The Graph Puzzle experience combines:

- Graph visualization
- Direct manipulation
- Search
- Optimization
- Complexity intuition

It includes Vertex Cover and Hamiltonian Cycle.

---

# 20. Vertex Cover Experience

## D1 — Graph Introduction

Nodes and edges appear progressively.

```text
A ─── B
│ \   │
C ─── D
```

---

## D2 — Challenge

> **Choose the smallest set of nodes that touches every edge.**

The learner taps nodes.

Selected node:

- expands slightly
- highlights its incident edges
- updates coverage

---

## D3 — Feedback

Covered edges glow.

Uncovered edges remain visible.

A progress indicator shows:

```text
7 / 8 edges covered
```

---

## D4 — Failure

If the learner chooses too many nodes:

> **The graph is covered—but is your solution minimal?**

This introduces optimization.

---

## D5 — Reveal

The app demonstrates a minimal solution.

Then:

> **This is Vertex Cover.**

Formal terminology comes after the visual concept.

---

# 21. Hamiltonian Cycle Experience

## D6 — Graph

A graph with 6–8 vertices.

---

## D7 — Challenge

> **Start at A. Visit every vertex exactly once. Return to A.**

---

## D8 — Path Drawing

User drags from node to node.

The route appears as an animated path.

---

## D9 — Invalid Move

If a node is revisited:

> **You already visited this vertex.**

The path briefly reverses or highlights the issue.

---

## D10 — Success

When a Hamiltonian cycle is found:

- path completes
- graph briefly transforms
- success animation
- route remains visible

---

## D11 — Search-Space Visualization

After success:

> **Now imagine trying this on a much larger graph.**

The system visually expands possible routes.

This transitions into computational complexity.

---

# 22. Visual Metaphors

Each concept should have an intentionally designed visual metaphor.

| Concept | Visual |
|---|---|
| Algorithm | Transformation pipeline |
| Input | Expanding dataset |
| Iteration | Repeating state loop |
| Correctness | Counterexample-proof loop |
| Complexity | Race |
| Growth | Expanding curves |
| O | Ceiling/boundary |
| Ω | Floor/boundary |
| Θ | Mathematical sandwich |
| Best case | Short path through execution |
| Worst case | Long execution path |
| Dominant operator | Highlighted repeated action |
| Polynomial | Controlled growth |
| Exponential | Explosive branching |
| P | Efficient problem region |
| NP | Verification challenge |
| Reduction | Problem transformation |
| Vertex Cover | Edge coverage |
| Hamiltonian Cycle | Route traversal |

---

# 23. Conceptual Animation Standards

Each complex visual should have three layers.

## Layer 1 — Intuition

What is happening?

## Layer 2 — Mechanism

Why is it happening?

## Layer 3 — Formalization

What is the technical definition?

Example:

```text
Visual behavior
       ↓
Algorithmic explanation
       ↓
O(n²)
```

This prevents formal notation from appearing meaningless.

---

# 24. Attention Sequencing

A sequence should not use the same interaction style repeatedly.

Preferred rhythm:

```text
Question
↓
Visual
↓
Prediction
↓
Animation
↓
Explanation
↓
Interaction
↓
Challenge
↓
Visual summary
```

Avoid:

```text
Text
Text
Text
Text
Quiz
Text
Text
```

---

# 25. Attention Metrics for the Prototype

The prototype should capture:

### Card-level

- Card viewed
- Card completed
- Card skipped
- Time on card
- Interaction started
- Interaction completed
- Prediction submitted
- Prediction correctness
- Card replayed
- Card revisited

### Session-level

- Session duration
- Cards/session
- Experience completion
- Exit point
- Return to previous card
- Rabbit-hole engagement

---

# 26. Learning Metrics

The prototype should also evaluate learning.

Example:

After the Complexity Race, show:

> Which grows faster for large n?

The learner answers.

Track:

- First-attempt accuracy
- Delayed recall
- Concept retention
- Ability to order growth classes

This distinguishes:

**attention**

from:

**learning.**

---

# 27. Design Quality Metrics

During prototype review, manually evaluate:

### Visual clarity

Can the concept be understood from the animation?

### Motion quality

Does the animation feel physically coherent?

### Interaction clarity

Is the available interaction obvious?

### Cognitive load

Is there too much happening?

### Visual hierarchy

Can the primary message be identified immediately?

### Continuity

Does the next card feel naturally connected?

---

# 28. UX Failure Conditions

The prototype fails if:

- It looks like PowerPoint.
- Cards contain too much text.
- Animation is decorative rather than explanatory.
- Interaction instructions are confusing.
- Transitions feel slow.
- Visual effects make the concept harder to understand.
- The user feels lost in navigation.
- Cards feel disconnected.
- The user can answer questions without understanding the concept.
- The interface becomes more prominent than the content.

---

# 29. Accessibility Requirements

The prototype must support:

- Reduced-motion preferences
- Keyboard navigation where applicable
- High-contrast text
- Non-color-only feedback
- Accessible labels for controls
- Alternative explanation for critical visual content

Animations should not be essential for accessing the information.

---

# 30. Responsive Behavior

The primary target is mobile-sized viewport because the interaction is inspired by short-form feeds.

However, the same experience should work on desktop.

### Mobile

Full-screen immersive card.

### Tablet

Centered content with larger visualization.

### Desktop

Content occupies a constrained visual stage rather than stretching across the entire screen.

---

# 31. Technical Architecture

Recommended prototype stack:

```text
Next.js
TypeScript
Tailwind CSS
Motion / Framer Motion
SVG
Canvas
React
```

Use WebGL/Three.js only where it genuinely improves a visualization.

---

# 32. Prototype Architecture

```text
src/
│
├── app/
│
├── components/
│   ├── feed/
│   ├── cards/
│   ├── animations/
│   ├── interactions/
│   └── ui/
│
├── content/
│   └── algorithms/
│
├── engine/
│   ├── feed/
│   ├── card-renderer/
│   └── learning/
│
├── visualizations/
│   ├── complexity/
│   ├── arrays/
│   ├── graphs/
│   └── execution/
│
└── lib/
```

---

# 33. Visualization Architecture

Create reusable algorithm visualization components.

Example:

```text
ComplexityRace
GrowthCurve
AlgorithmRunner
ArrayVisualizer
ExecutionTrace
GraphVisualizer
VertexCoverVisualizer
HamiltonianCycleVisualizer
```

These should accept data rather than hard-coded content.

---

# 34. Example Component Model

```text
<ComplexityRace
    functions={[
        "log",
        "linear",
        "nlogn",
        "quadratic",
        "exponential"
    ]}
    inputSize={1000}
/>
```

The visualization should reactively animate when the input size changes.

---

# 35. Content Architecture

Prototype content should live separately from UI code.

```text
content/
└── algorithms/
    ├── complexity/
    ├── execution/
    ├── correctness/
    └── graphs/
```

Each sequence contains:

- Learning objective
- Concept metadata
- Cards
- Prerequisites
- Visual configuration
- Interaction definition
- Next-card relationships

---

# 36. Feed Engine — Prototype Version

The first version does not need machine learning.

Use deterministic sequencing with intentional variety.

Example:

```text
Hook
→ Prediction
→ Visual
→ Explanation
→ Interaction
→ Challenge
→ Summary
```

Later this becomes adaptive.

---

# 37. Transition System

Cards should transition using motion rather than page replacement.

Examples:

### Vertical continuation

Natural upward movement.

### Concept transformation

Current visual morphs into the next visual where possible.

### Challenge → Reveal

The user's selected object transforms into the result.

### Topic transition

Visual zoom-out from the current concept into the next conceptual layer.

---

# 38. Example Concept Transition

Complexity Race:

```text
O(n)
```

curve grows.

Then:

> **But how do we actually count the work?**

The curve visually transforms into:

```text
for i in range(n)
```

The feed transitions from:

**complexity**

to:

**algorithm execution**

This creates conceptual continuity.

---

# 39. Prototype Navigation

Primary:

**Swipe**

Secondary:

- Home
- Track selector
- Progress
- Restart experience

Avoid excessive navigation during the learning session.

---

# 40. Track Landing Page

Before entering the feed:

```text
DESIGN & ANALYSIS
OF ALGORITHMS

Learn how algorithms
behave, scale, fail
and survive.

[ Continue ]
```

Visual:

A dynamic network/algorithm visualization running subtly in the background.

---

# 41. Experience Selection

Instead of exposing a course table, initially show:

```text
Explore

⚡ Complexity Race
How algorithms behave at scale

▶ Run an Algorithm
Watch the logic execute

🧩 Break the Algorithm
Find the bug

🕸 Graph Puzzles
Solve algorithmic graph problems
```

This makes the curriculum feel like an interactive playground.

---

# 42. Completion Experience

After an experience:

Avoid a generic:

> “Congratulations!”

Instead:

```text
You just connected:

Input Size
     ↓
Operations
     ↓
Growth
     ↓
Complexity
```

Then:

> **Next: Why some problems become computationally brutal.**

This provides a natural continuation into P/NP.

---

# 43. Recommended Prototype Content Count

## Complexity Race

8–12 cards

## Algorithm Execution

10–12 cards

## Break the Algorithm

8–10 cards

## Graph Puzzle

12–15 cards

Total:

**Approximately 40–50 highly polished cards.**

Quality is more important than volume.

---

# 44. Prototype Development Priority

## Priority 1

Feed mechanics

## Priority 2

Animation system

## Priority 3

Complexity Race

## Priority 4

Algorithm Runner

## Priority 5

Counterexample Challenge

## Priority 6

Graph visualizations

## Priority 7

Progress / analytics

The first three priorities determine whether the product actually feels right.

---

# 45. Prototype Acceptance Criteria

The V0.2 prototype is considered successful when:

### UX

A first-time user can begin interacting without instruction.

### Visual

The experience looks noticeably different from traditional learning software.

### Motion

Transitions are smooth and intentional.

### Learning

The user can correctly explain the basic intuition behind the concepts demonstrated.

### Engagement

Users voluntarily continue through multiple cards.

### Technical

Adding another card type does not require rewriting the feed architecture.

### Extensibility

A new algorithmic visualization can be added as a reusable component.

---

# 46. Definition of Done — Complexity Race

The experience is complete when:

- Growth curves render smoothly.
- Input-size controls work.
- Curves respond dynamically.
- Relative growth is visually obvious.
- Prediction cards work.
- Drag-to-rank works.
- The sequence has intentional attention rhythm.
- The learner receives conceptual feedback.
- The experience transitions naturally into Algorithm Execution.

---

# 47. Definition of Done — Algorithm Runner

Complete when:

- Arrays can be visualized.
- Pointer movement is animated.
- State updates are visible.
- Operations can be counted.
- Best/worst cases can be demonstrated.
- User can modify input.
- Complexity is connected to observed operations.

---

# 48. Definition of Done — Break the Algorithm

Complete when:

- A flawed algorithm can be visualized.
- Users can test inputs.
- Counterexamples are identified.
- Failure is animated.
- Corrected algorithm can be replayed.
- The correctness concept is clearly communicated.

---

# 49. Definition of Done — Graph Puzzle

Complete when:

- Nodes and edges can be manipulated.
- Vertex Cover can be solved interactively.
- Hamiltonian Cycle can be drawn interactively.
- Invalid moves produce immediate feedback.
- Correct solutions produce visual payoff.
- Search-space growth can be demonstrated.

---

# 50. Future Expansion

After the prototype succeeds, extend the track with:

```text
Algorithms
 ↓
Analysis
 ↓
Asymptotic Notation
 ↓
Complexity Classes
 ↓
P
 ↓
NP
 ↓
Reduction
 ↓
NP-Complete
 ↓
NP-Hard
```

Each should use the same interaction philosophy.

Potential future experiences:

- Big-O visual sandbox
- Complexity calculator
- Search-tree explosion
- Reduction machine
- 3-SAT puzzle
- Dynamic Programming state explorer
- Greedy strategy challenge
- Divide-and-conquer visualizer

---

# 51. Long-Term Vision for the Algorithms Track

Eventually, the entire track can become an interactive laboratory:

```text
             ALGORITHM LAB
                    │
        ┌───────────┼───────────┐
        ↓           ↓           ↓
     DESIGN      ANALYZE      BREAK
        │           │           │
        ↓           ↓           ↓
     Build It    Measure It   Attack It
        │           │           │
        └───────────┼───────────┘
                    ↓
                 UNDERSTAND
```

The user's relationship with an algorithm becomes:

> **Build it → Run it → Observe it → Break it → Analyze it → Understand it.**

That is the long-term interaction model we should aim for.

---

# 52. Final Product Principle

For the Algorithms prototype, we should **not** ask:

> “How do we make the textbook more interactive?”

We should ask:

> **“How can the learner experience the behavior of the algorithm directly?”**

An algorithm should **move**.

A complexity class should **race**.

A bug should **break**.

A graph problem should be **solved**.

A proof should **survive challenges**.

Growth should **explode in front of the learner**.

That is the UX direction that differentiates ScrollLearn from a conventional educational platform.

---

# 53. Immediate Build Target

The first coded milestone should therefore be:

## **Algorithms Interactive Playground**

Containing:

```text
Complexity Race
+
Algorithm Runner
+
Break the Algorithm
+
Graph Puzzle
```

with:

**one unified feed engine**

**one unified animation system**

**one unified design system**

**one unified card schema**

rather than four disconnected demos.

That architecture will let this prototype become the foundation for the rest of ScrollLearn.