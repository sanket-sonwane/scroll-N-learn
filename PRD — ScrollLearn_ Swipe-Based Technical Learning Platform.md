# ScrollLearn
## Product Requirements Document (PRD)

**Version:** V0.1  
**Status:** Product Definition  
**Platform:** Responsive Web App + PWA  
**Primary UX Goal:** Make high-quality technical learning as effortless and engaging as short-form scrolling, without reducing the learning experience to shallow entertainment.

---

# 1. Product Overview

ScrollLearn is a swipe-first learning platform designed for people who naturally reach for short-form content whenever they have a few free minutes.

Instead of fighting that behavior, ScrollLearn redirects it toward learning.

The user opens the application, chooses a learning track, and enters a full-screen vertical feed of highly visual, interactive learning cards.

Each card teaches **one small concept** using a combination of:

- Visual explanations
- Motion and animation
- Interactive diagrams
- Micro-quizzes
- Prediction/reveal interactions
- Equations
- Code
- Simulations
- Comparisons
- Progressive visual disclosure
- Short explanations

The experience should feel closer to a premium modern media product than a traditional LMS.

The underlying curriculum, however, must remain rigorous.

The core principle is:

> **The consumption experience should feel effortless; the underlying learning system should be structured and technically rigorous.**

---

# 2. Product Thesis

Traditional learning applications generally optimize for:

**content → completion → certification**

Short-form products optimize for:

**attention → curiosity → continuation**

ScrollLearn combines the two:

**curiosity → interaction → understanding → reward → curiosity for the next concept**

The product should not attempt to maximize addictive behavior or manipulate users into excessive usage.

Instead, it should use proven interaction patterns from modern consumer interfaces—fast feedback, visual novelty, anticipation, progressive disclosure, interactivity, and personalization—while making **understanding itself the reward**.

---

# 3. Problem Statement

There is a gap between:

### The user's intention

> “I want to learn Machine Learning.”

and

### The user's actual behavior

> “I have 10 minutes. I'll just scroll Instagram/YouTube.”

Traditional learning platforms introduce too much friction:

- Find course
- Open lecture
- Commit to a chapter
- Read large amounts of text
- Watch a long video
- Take notes
- Complete exercises

This is badly matched to short periods of free time.

The user needs something that supports:

> **“I have 3–10 minutes. Give me something interesting to learn.”**

---

# 4. Target User

## Primary User

Technically curious students and early-career engineers who want to continuously improve their knowledge in areas such as:

- Machine Learning
- Deep Learning
- LLMs
- AI Engineering
- Inference
- MLOps
- Systems
- Distributed Systems
- Computer Science
- Cybersecurity

Typical situation:

> Waiting for transportation  
> Waiting between classes  
> Sitting in a queue  
> Taking a break  
> Before sleeping  
> Short period between tasks

The user already has a habit of consuming short-form content.

ScrollLearn attempts to redirect that behavior.

---

# 5. Primary User Persona

### Persona: Technical Learner

**Motivation**

- Wants to become technically stronger
- Wants to understand modern technologies deeply
- Enjoys discovering interesting technical concepts
- Often explores beyond formal coursework

**Behavior**

- Has limited uninterrupted study time
- Consumes YouTube, Instagram, Reddit, technical blogs, etc.
- Frequently saves content but doesn't return to it
- Gets bored by long theoretical explanations
- Enjoys visual demonstrations
- Likes “aha!” moments
- Enjoys going down technical rabbit holes

**Pain Point**

They don't necessarily lack motivation to learn.

They lack a **low-friction learning environment that matches their natural consumption behavior.**

---

# 6. Product Goals

## Primary Goals

### G1 — Create an extremely compelling learning interaction

Opening the application should immediately produce:

> “This is interesting. I want to see the next card.”

### G2 — Reduce learning friction

A user should be able to start learning within seconds.

### G3 — Teach complex technical concepts through visualization

Abstract concepts should become visually understandable.

### G4 — Maintain conceptual continuity

The application should not become random trivia scrolling.

### G5 — Enable learning in very short sessions

A user should be able to gain something meaningful in:

- 30 seconds
- 2 minutes
- 5 minutes
- 10 minutes
- 20+ minutes

### G6 — Build genuine knowledge

The system must eventually support:

- Recall
- Prediction
- Application
- Reinforcement
- Prerequisites
- Mastery

### G7 — Create a scalable content architecture

Adding a new technical topic should not require redesigning the entire application.

---

# 7. Non-Goals

The initial product will NOT attempt to become:

- A complete Udemy replacement
- A long-form video platform
- A traditional LMS
- A social network
- A generic news feed
- A certification platform
- A coding interview platform
- An AI chatbot replacing the curriculum
- A platform with hundreds of subjects at launch

The first release should optimize one thing:

> **A world-class short-form technical learning experience.**

---

# 8. Core Experience

The fundamental loop:

```text
Open
  ↓
Resume learning
  ↓
Full-screen card
  ↓
Hook
  ↓
Visual interaction
  ↓
Prediction / exploration
  ↓
Reveal
  ↓
Micro-reward
  ↓
Next connected concept
  ↓
Continue
```

The experience should feel:

**Fast + Beautiful + Curious + Interactive + Rewarding**

while remaining:

**Structured + Accurate + Educational**

---

# 9. UX North Star

The product should satisfy this test:

> **A user should open ScrollLearn because they want to scroll, but leave having learned something they actually understand.**

The user should never feel:

> “I'm studying.”

They should feel:

> “This is interesting.”

And afterward:

> “Wait, I actually understand that now.”

---

# 10. UX Principles

## Principle 1 — One Card, One Idea

A card should communicate one primary concept.

Avoid information-heavy slides.

Bad:

> 250 words + 3 diagrams + 2 equations

Good:

> One question + one visual + one insight.

---

## Principle 2 — Visual First

For suitable concepts:

**visual → explanation**

rather than:

**paragraph → explanation of visual**

---

## Principle 3 — Curiosity Before Explanation

Whenever possible:

> Ask the question before providing the answer.

Example:

> “Why does increasing model complexity eventually make validation performance worse?”

Then reveal over subsequent cards.

---

## Principle 4 — Progressive Disclosure

Do not expose the entire concept immediately.

Reveal complexity progressively.

Example:

```text
Transformer
     ↓
Attention
     ↓
Self-Attention
     ↓
Q / K / V
     ↓
Attention Scores
     ↓
Softmax
     ↓
Multi-Head Attention
```

---

## Principle 5 — Interaction Before Passive Reading

Whenever a concept supports interaction, prefer:

**predict → interact → observe → understand**

over passive text.

---

## Principle 6 — Motion Must Have Meaning

Animations must communicate:

- Causality
- Flow
- Transformation
- Relationship
- Comparison
- State change

Avoid decorative motion that exists only because animation is technically possible.

---

## Principle 7 — Visual Rhythm

Every card should not have maximum visual intensity.

The feed needs rhythm:

```text
High curiosity
      ↓
Visual payoff
      ↓
Simple explanation
      ↓
Interactive card
      ↓
Visual transformation
      ↓
Micro-recall
      ↓
Surprise / deeper concept
```

This prevents cognitive exhaustion.

---

# 11. The Card System

The card is the fundamental product unit.

Every card contains a structured specification rather than being hard-coded as a unique page.

Conceptually:

```text
Card
├── Identity
├── Concept
├── Hook
├── Content
├── Visual
├── Interaction
├── Explanation
├── Learning objective
├── Difficulty
├── Prerequisites
├── Related concepts
└── Next-card relationships
```

---

# 12. Card Types

The application should support a reusable card library.

## 12.1 Hook Card

Large question or provocative statement.

Example:

> **Why does an LLM get slower as context grows?**

Purpose:

Create curiosity.

---

## 12.2 Concept Card

Minimal explanation.

Example:

> **KV Cache stores previously computed attention information so the model doesn't repeatedly calculate the same information.**

Visual support should accompany the explanation.

---

## 12.3 Visual Explanation Card

The entire concept is communicated primarily through animation.

Example:

Token sequence → attention → cached K/V → next token.

---

## 12.4 Prediction Card

Ask the learner what will happen.

Example:

> What happens if the learning rate becomes 100× larger?

Options:

A. Training becomes faster  
B. Training becomes unstable  
C. Nothing changes  
D. Loss becomes zero

---

## 12.5 Reveal Card

Shows the correct answer with animation.

Prediction:

> B

Then:

**Visual demonstration → explanation**

---

## 12.6 Interactive Simulation

User modifies parameters.

Examples:

- Learning rate
- Temperature
- Batch size
- Regularization
- Threshold
- Vector position
- Model depth

The visualization responds immediately.

---

## 12.7 Diagram Card

Interactive architecture or conceptual representation.

Examples:

- Transformer
- RAG pipeline
- GPU architecture
- CNN
- Database index
- Network topology

---

## 12.8 Comparison Card

Example:

```text
RNN                  Transformer

Sequential           Parallel
context limited      long-range context
recurrent state      attention
```

Animation should visually establish the distinction.

---

## 12.9 Code Card

Small pieces of code rather than large blocks.

Example:

```python
loss.backward()
optimizer.step()
```

Each line can become highlighted and conceptually connected to a diagram.

---

## 12.10 Equation Card

Equations should be visually explained.

Example:

```text
θ ← θ - η∇L
```

Rather than displaying the equation and leaving the learner to decode it:

```text
θ        → parameters
η        → learning rate
∇L       → direction of error
```

---

## 12.11 Timeline Card

Useful for:

- Evolution of architectures
- GPU development
- ML history
- Transformer evolution

---

## 12.12 Concept Map Card

Shows relationships between concepts.

Example:

```text
Attention
   │
   ├── Self Attention
   │      ├── Q
   │      ├── K
   │      └── V
   │
   └── Multi Head Attention
```

---

# 13. Visual System

Visual quality is a core product requirement rather than a cosmetic layer.

The product should feel closer to:

- premium consumer applications
- high-end interactive data visualization
- modern developer tools
- interactive scientific visualizations

than:

- PowerPoint
- LMS dashboards
- traditional course platforms

---

# 14. Animation System

Animations should be generated from reusable primitives.

Potential primitives:

```text
TokenFlow
NodeGraph
ParticleFlow
VectorField
LayerStack
MemoryBlock
Pipeline
CodeTransform
Timeline
Heatmap
CoordinatePlane
NetworkGraph
Matrix
DataStream
ComparisonSplit
```

Example:

### Attention

Could use:

```text
TokenFlow
+
ConnectionGraph
+
Heatmap
+
Matrix
```

### RAG

Could use:

```text
Query
→ Retriever
→ Vector Database
→ Documents
→ Context
→ LLM
```

### KV Cache

Could use:

```text
TokenFlow
+
Attention
+
MemoryBlock
```

This enables scalable visual content creation.

---

# 15. Animation Guidelines

Animations must generally follow:

### Anticipation

Something is about to happen.

### Transformation

The visual changes.

### Explanation

The user sees why.

### Resolution

The visual settles.

Example:

```text
Question
   ↓
Visual tension
   ↓
Transformation
   ↓
Explanation
   ↓
Stable state
```

Animations should normally be:

- Smooth
- Short
- Purposeful
- Interruptible
- Touch-responsive
- GPU-friendly
- Consistent across the platform

---

# 16. Interaction Design

Interactions should feel immediate.

Target:

**User action → visual response**

with effectively no noticeable delay for local interactions.

Interactions include:

- Tap
- Swipe
- Drag
- Hold
- Scrub
- Select
- Expand
- Reveal
- Manipulate

Avoid complex controls.

The learner should understand an interaction without reading instructions whenever possible.

---

# 17. Swipe Experience

The main feed should occupy the complete viewport.

Conceptually:

```text
┌──────────────────────────────┐
│ Track / Topic                │
│                              │
│                              │
│       CARD CONTENT           │
│                              │
│                              │
│                        ●     │
│                        ●     │
│                        ●     │
│                              │
│ Concept 3 / 12               │
└──────────────────────────────┘
```

Navigation should be nearly invisible.

The content should dominate.

---

# 18. Scroll Mechanics

Primary interaction:

**Vertical swipe**

The user should be able to:

- swipe naturally
- flick quickly
- pause
- revisit previous cards
- continue from the exact position

Transitions should feel physically natural.

Avoid jarring page reloads.

---

# 19. Attention Architecture

The product should measure attention without turning the experience into manipulative behavioral optimization.

Useful signals:

```text
time_on_card
completion_rate
skip_rate
backtrack_rate
interaction_rate
prediction_attempt_rate
prediction_accuracy
animation_completion
concept_revisit_rate
session_length
return_frequency
```

These signals are useful primarily for answering:

> **Is the user understanding and enjoying the experience?**

rather than:

> **How do we keep them scrolling forever?**

---

# 20. Attention Pattern Library

The system should intentionally vary attention mechanisms.

Possible patterns:

```text
Question
Prediction
Mystery
Transformation
Contrast
Surprise
Manipulation
Progressive Reveal
Challenge
Cause → Effect
Visual Story
Rabbit Hole
```

Each lesson sequence can mix these patterns.

---

# 21. Curiosity Loops

A card may create an unresolved question.

Example:

> **There's a problem with this approach.**

Next:

> **Can you spot it?**

Next:

Interactive visualization.

Next:

> **Here's why.**

Next:

> **And that's why Transformers do this instead…**

This creates a connected sequence rather than isolated cards.

---

# 22. Rabbit Hole System

Every major concept can expose deeper related concepts.

Example:

```text
Attention
│
├── Self-Attention
├── Cross-Attention
├── Q/K/V
├── Multi-Head Attention
├── Flash Attention
├── Sparse Attention
└── KV Cache
```

Users may optionally enter a rabbit hole.

The system remembers where they came from.

The user can return to the main curriculum without losing progress.

---

# 23. Curriculum Architecture

Curriculum structure:

```text
Track
  ↓
Domain
  ↓
Chapter
  ↓
Topic
  ↓
Concept
  ↓
Cards
```

Example:

```text
AI Engineering
    ↓
Deep Learning
    ↓
Neural Networks
    ↓
Backpropagation
    ↓
Chain Rule
    ↓
Gradient Computation
    ↓
Weight Updates
```

---

# 24. Concept Graph

The curriculum should not merely be a tree.

It should be a graph.

A concept can have:

- prerequisites
- related concepts
- deeper concepts
- applications
- visual analogies
- reinforcement concepts

Example:

```text
Attention
   ↓
Self Attention
   ↓
Q/K/V
   ↓
Multi Head Attention
   ↓
Transformer
   ↓
LLM
```

But:

```text
GPU Memory
       ↘
        KV Cache
       ↗
Inference
```

This enables adaptive learning.

---

# 25. First Launch Curriculum

The MVP should launch with one highly polished curriculum.

Recommended:

## Machine Learning → Neural Networks

Possible concepts:

```text
1. What is a Neural Network?
2. Perceptron
3. Weights
4. Bias
5. Activation Functions
6. Forward Propagation
7. Loss Functions
8. Gradient
9. Gradient Descent
10. Learning Rate
11. Backpropagation
12. Chain Rule
13. Batch Training
14. Epochs
15. Overfitting
16. Regularization
17. Dropout
18. Validation
19. Optimization
20. Putting it all together
```

The first release should contain approximately **50–100 exceptional cards**, not thousands of mediocre cards.

---

# 26. AI Engineering Expansion

After validating the experience, expand into:

```text
Machine Learning
Deep Learning
LLMs
Transformers
RAG
AI Agents
Model Fine-Tuning
Inference
Model Serving
GPU Computing
MLOps
Evaluation
AI Security
```

---

# 27. Learning Session Design

The user should not need to choose a fixed session length.

Examples:

### 30 seconds

1–3 cards.

### 5 minutes

A coherent mini-concept.

### 10 minutes

A complete concept cluster.

### 20+ minutes

Deep exploration.

The system should preserve conceptual continuity even when a session ends abruptly.

---

# 28. Resume Experience

When reopening:

> **Continue**

Not:

> Dashboard → Course → Chapter → Topic → Resume.

The user should return directly to:

> **The next meaningful card.**

Example:

> **You stopped while learning Backpropagation.**

Then immediately present the next card.

---

# 29. Progression

Progress should be visual and lightweight.

Example:

```text
Neural Networks

██████████████░░ 82%

16 / 20 concepts
```

But progression should not dominate the interface.

More useful:

> **You now understand 16 connected concepts.**

The system should visualize knowledge relationships where possible.

---

# 30. Mastery Model

Eventually each concept receives an estimated mastery state:

```text
Unknown
   ↓
Seen
   ↓
Understood
   ↓
Recallable
   ↓
Applied
   ↓
Mastered
```

A user shouldn't be considered “done” simply because they viewed a card.

---

# 31. Reinforcement

The application should periodically revisit older concepts.

Example:

A week after learning gradient descent:

> **Quick question: Which direction should the parameter move?**

A 3-second recall interaction.

Then:

> Correct.

No long review session required.

---

# 32. Personalization

The application should eventually personalize:

- Difficulty
- Card type
- Visual style
- Review frequency
- Topic depth
- Rabbit-hole suggestions
- Session intensity

Example:

If a learner consistently performs well on interactive conceptual questions but struggles with equations, the presentation strategy can adapt.

Important rule:

> **Personalization changes presentation more readily than core curriculum requirements.**

---

# 33. Content Generation Architecture

The LLM should NOT initially generate uncontrolled educational content directly into the production feed.

Recommended architecture:

```text
Authoritative Sources
        ↓
Curriculum
        ↓
Concept Definition
        ↓
Learning Objective
        ↓
LLM-assisted Draft
        ↓
Fact Validation
        ↓
Visual Specification
        ↓
Card Sequence
        ↓
Human/Automated QA
        ↓
Production
```

AI is initially a **content-generation assistant**, not the sole authority.

---

# 34. Structured Content Format

A card should ultimately be represented as structured data.

Conceptual example:

```json
{
  "id": "attention-kv-cache-01",
  "concept": "KV Cache",
  "type": "visual_explanation",
  "objective": "Explain why KV caching reduces repeated computation during autoregressive inference",
  "hook": "Why does LLM inference slow down as context grows?",
  "visual": {
    "type": "token_memory_flow",
    "animation": "progressive_cache"
  },
  "interaction": null,
  "difficulty": 3,
  "prerequisites": [
    "self-attention",
    "transformer"
  ],
  "next": [
    "paged-attention"
  ]
}
```

The rendering engine interprets the specification.

---

# 35. Feed Orchestrator

The feed engine determines the next card.

Initial conceptual strategy:

```text
70% curriculum progression
15% reinforcement
10% curiosity / rabbit hole
5% surprise / exploration
```

These are starting hypotheses, not permanent values.

The engine should consider:

- Current concept
- Prerequisites
- User mastery
- Recent interactions
- Session length
- Topic preference
- Difficulty
- Card variety
- Recent visual patterns

---

# 36. Feed Continuity

Bad sequence:

```text
Backpropagation
→ Docker
→ Tokenization
→ SQL
→ CNN
```

Good sequence:

```text
Backpropagation
→ Gradient
→ Chain Rule
→ Weight Update
→ Learning Rate
→ Optimization
```

The feed should feel like a **knowledge journey**, not a random content feed.

---

# 37. Visual Rhythm Algorithm

The feed should prevent sequences like:

```text
Text
Text
Text
Text
Text
```

or:

```text
Animation
Animation
Animation
Animation
```

Instead the system should have visual pacing:

```text
Hook
→ Visual
→ Prediction
→ Explanation
→ Interactive
→ Simple recap
→ Surprise
```

A card sequence should have an intentional emotional/cognitive rhythm.

---

# 38. Design System

The product design should be:

**Modern, minimal, immersive, technical, premium.**

Characteristics:

- High visual hierarchy
- Large typography
- Generous whitespace
- Dark/light themes
- Subtle gradients where appropriate
- Smooth motion
- Glass/material effects used sparingly
- Precise micro-interactions
- Strong visual focus
- Minimal UI chrome

The interface must not resemble a conventional LMS.

---

# 39. Typography

Typography must optimize:

- Fast scanning
- Large conceptual statements
- Technical readability
- Code readability
- Mathematical notation

A card should communicate its primary idea immediately.

---

# 40. Color System

Color should communicate semantic meaning.

For example:

```text
Blue → information
Green → correct / successful
Orange → warning / uncertainty
Red → error
Purple → AI / transformation
```

But color should never be the only means of communicating meaning.

---

# 41. Micro-Interactions

Every meaningful user action should receive appropriate feedback.

Examples:

- Tap → subtle scale response
- Correct answer → satisfying visual confirmation
- Drag → responsive object movement
- Swipe → physical transition
- Completion → concept graph update
- Returning → subtle continuity indicator

Micro-interactions should be quick and restrained.

---

# 42. Sound

Sound is **optional**, not required.

Default:

**Muted / silent experience**

Potential future support:

- subtle interaction sound
- success sound
- optional haptic feedback on mobile

Audio must never be necessary to understand content.

---

# 43. Accessibility

Modern UX must remain accessible.

Requirements:

- Respect reduced-motion settings
- Keyboard navigation
- Screen-reader compatible text
- Sufficient contrast
- Captions/alternative descriptions for visual information
- Interaction alternatives
- Avoid flashing effects
- Do not rely solely on color

Important:

> Accessibility should not be treated as a post-launch feature.

---

# 44. Responsive Platform Strategy

## V0

Responsive web application.

Primary target:

**Desktop + mobile browser**

## PWA

Support:

- Installability
- Full-screen mode
- Offline caching
- Local session persistence
- Push notifications where supported

This avoids requiring Android Studio or Flutter.

---

# 45. Recommended Technical Stack

## Frontend

**Next.js**

**TypeScript**

**Tailwind CSS**

Motion system:

**Framer Motion / Motion**

Visualization:

**SVG**

**Canvas**

**WebGL / Three.js where justified**

Potential interactive graph libraries can be introduced later.

---

# 46. Backend

Recommended:

**FastAPI**

Responsibilities:

- Authentication
- User profile
- Curriculum
- Concept graph
- Learning state
- Feed generation
- Analytics

---

# 47. Database

**PostgreSQL**

Core entities:

```text
users
tracks
chapters
topics
concepts
cards
card_relations
prerequisites
sessions
interactions
mastery
learning_events
```

---

# 48. Content Storage

Use structured content rather than embedding content directly in frontend components.

Possible structure:

```text
/content
   /tracks
      /machine-learning
         /neural-networks
            concepts.json
            cards.json
            visuals/
```

During early development, local JSON is sufficient.

---

# 49. Analytics

Track:

```text
session_start
card_view
card_complete
card_skip
card_back
interaction_start
interaction_complete
prediction_answer
prediction_correct
concept_complete
rabbit_hole_enter
rabbit_hole_exit
session_end
```

Do not collect unnecessary personal information.

---

# 50. Performance Requirements

Performance is critical because latency directly harms the UX.

Targets:

**Initial application load:** ideally <2 seconds on good connections.

**Next-card transition:** visually immediate.

**Local interaction response:** effectively immediate.

**Animation:** target 60 FPS on supported devices.

Heavy visualizations should be lazy-loaded.

The next cards should be prefetched before the user reaches them.

---

# 51. Card Preloading

The application should maintain:

```text
Current Card
     +
Next Card
     +
Next 2–3 Card Assets
```

This prevents transition delays.

Images, animation assets, and data should be prefetched intelligently.

---

# 52. Offline Strategy

Eventually:

```text
Track content
   ↓
Local cache
   ↓
User can continue
   ↓
Events sync later
```

This is particularly useful for:

- Travel
- Commutes
- Poor connectivity

This feature is highly aligned with the original use case.

---

# 53. MVP Scope

## Must Have

- Responsive web app
- PWA foundation
- Full-screen feed
- Vertical swipe
- Smooth transitions
- 50–100 curated cards
- One learning track
- Multiple card types
- At least several high-quality animations
- Concept progression
- Basic progress
- Resume position
- Basic interaction analytics

## Should Have

- Interactive simulations
- Concept graph
- Rabbit holes
- Dark/light mode
- Offline caching

## Later

- AI-generated content
- Adaptive feed
- Personalization
- User accounts
- Spaced repetition
- Multiple tracks
- Advanced mastery model

---

# 54. MVP Success Criteria

The MVP should answer one question:

> **Would someone voluntarily choose this instead of opening a short-form entertainment app when they have a few free minutes?**

Initial success signals:

### Engagement

- High first-session continuation
- Low immediate abandonment
- High completion of short card sequences
- Users voluntarily continuing beyond the first few cards

### UX

- Smooth scrolling
- No noticeable animation stutter
- Fast card transitions
- Low interaction friction

### Learning

- Good prediction accuracy after learning
- Successful short recall tests
- Users can explain concepts after completing a sequence

### Product

- Users return without external reminders
- Users explore adjacent concepts
- Users voluntarily enter rabbit holes

---

# 55. Critical Product Metrics

Do not optimize purely for session length.

Track:

### Attention Quality

```text
Card completion rate
Skip rate
Interaction rate
Prediction attempt rate
Replay rate
```

### Learning Quality

```text
Recall accuracy
Prediction accuracy
Delayed recall
Concept mastery
Prerequisite completion
```

### Product Quality

```text
First-session continuation
Day-1 return
Day-7 return
Sessions/user
Concepts/session
```

The ideal user is not necessarily the one who spends the most time.

The ideal user is someone who:

> opens → learns → remembers → returns.

---

# 56. Ethical Product Constraint

This should be an explicit product requirement.

ScrollLearn must not intentionally employ dark patterns such as:

- Preventing users from exiting
- Misleading rewards
- Artificial guilt
- Infinite forced engagement
- Deceptive notifications
- Manipulative urgency
- Concealing session duration
- Punishing users for taking breaks

The design can borrow **engagement mechanics**, but the objective remains learning.

The product should make the user feel:

> “I chose to keep going because this is interesting.”

not:

> “The app manipulated me into staying.”

---

# 57. First Prototype

The first engineering milestone should NOT be the complete application.

Build:

## “Transformer Attention Experience”

Approximately **8–12 cards**.

Sequence:

```text
1. Curiosity Hook
2. Prediction
3. Token visualization
4. Attention relationship
5. Q/K/V introduction
6. Interactive Q/K visualization
7. Attention matrix
8. Multi-head explanation
9. Recall question
10. Concept map
```

This prototype becomes the benchmark for:

- Visual quality
- Animation quality
- Interaction quality
- Feed mechanics
- Typography
- Card transitions
- Content density

---

# 58. Prototype Acceptance Test

A user should be able to open the prototype with no explanation and immediately understand:

1. What the question is
2. What action they can take
3. What changed
4. What they learned
5. Why they should continue

The prototype fails if the user asks:

> “What am I supposed to click?”

or:

> “Is this just a slideshow?”

---

# 59. Development Roadmap

## Phase 0 — Experience Prototype

Build:

- Feed
- Card engine
- Animation primitives
- 8–12 exceptional cards
- Transformer Attention demo

Objective:

**Validate the interaction model.**

---

## Phase 1 — MVP

Build:

- 50–100 cards
- Neural Network curriculum
- Multiple card types
- Basic progress
- Basic analytics
- PWA
- Performance optimization

Objective:

**Validate repeated usage.**

---

## Phase 2 — Learning Engine

Add:

- Concept graph
- Prerequisites
- Mastery
- Reinforcement
- Rabbit holes
- Adaptive sequencing

Objective:

**Validate actual learning effectiveness.**

---

## Phase 3 — AI Content Engine

Add:

- LLM-assisted content generation
- Visual specification generation
- Content validation
- Automatic card sequencing
- Personalization

Objective:

**Scale content production.**

---

## Phase 4 — Platform

Add:

- Multiple tracks
- Accounts
- Cross-device sync
- Advanced analytics
- Community/content ecosystem
- More advanced simulations

Objective:

**Turn the prototype into a platform.**

---

# 60. Long-Term Product Architecture

The eventual system:

```text
                         ┌─────────────────────┐
                         │   CURRICULUM        │
                         │                     │
                         │ Tracks              │
                         │ Topics              │
                         │ Concepts            │
                         │ Prerequisites       │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ CONTENT ENGINE      │
                         │                     │
                         │ Text                │
                         │ Diagrams            │
                         │ Animations          │
                         │ Simulations         │
                         │ Quizzes             │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ FEED ORCHESTRATOR   │
                         │                     │
                         │ Sequence            │
                         │ Difficulty           │
                         │ Variety             │
                         │ Curiosity           │
                         │ Reinforcement       │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ EXPERIENCE ENGINE   │
                         │                     │
                         │ Card Renderer       │
                         │ Motion              │
                         │ Interaction         │
                         │ Visualization       │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │       USER          │
                         └──────────┬──────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ LEARNER MODEL       │
                         │                     │
                         │ Mastery             │
                         │ Recall              │
                         │ Preferences         │
                         │ Behavior            │
                         └──────────┬──────────┘
                                    │
                                    └────→ Feed
```

---

# 61. The Most Important Engineering Principle

The application should be built around a **content renderer**, not around individual pages.

Instead of:

```text
BackpropagationPage.tsx
AttentionPage.tsx
KVCachePage.tsx
RAGPage.tsx
```

build:

```text
CardRenderer
├── HookCard
├── ConceptCard
├── QuizCard
├── DiagramCard
├── CodeCard
├── EquationCard
├── SimulationCard
├── ComparisonCard
├── RevealCard
└── ConceptMapCard
```

Then content drives the application.

This is what allows the platform to scale.

---

# 62. Product Differentiation

The competitive advantage should ultimately come from the combination of:

**1. Short-form interaction**

+

**2. Serious technical curriculum**

+

**3. High-quality visual explanations**

+

**4. Interactive simulations**

+

**5. Concept graph**

+

**6. Adaptive sequencing**

+

**7. Reusable visualization engine**

Rather than any individual feature.

---

# 63. Final Product Vision

The mature product should feel like this:

> You have five minutes.

You open ScrollLearn.

You immediately see:

> **“Why does your GPU sometimes spend more time waiting than calculating?”**

You swipe.

A visualization starts.

You predict what will happen.

You interact with it.

You discover memory bandwidth.

The next card asks:

> **“So what happens when the model gets 128K tokens?”**

You want to know.

Swipe.

The visualization expands.

You discover KV Cache.

Then PagedAttention.

Then batching.

Suddenly 10 minutes have passed.

But unlike doomscrolling:

> **You gained a connected piece of technical knowledge.**

That is the product we should build.

---

# 64. V0 Product Mantra

Everything we design should pass these five questions:

### Is it immediately interesting?

### Can the user understand the interaction without instructions?

### Does the visual communicate something meaningful?

### Does the interaction create understanding rather than just stimulation?

### Does the next card make the user curious about the concept that follows?

If the answer to these is consistently **yes**, we have the foundation for the product.