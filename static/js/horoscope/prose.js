/**
 * horoscope/prose.js
 *
 * Deterministic reader-facing prose layer for AstroLight.
 *
 * Pipeline:
 *
 *   astronomy
 *      ↓
 *   planetary snapshot
 *      ↓
 *   relationships
 *      ↓
 *   aspects
 *      ↓
 *   scoring
 *      ↓
 *   interpretation
 *      ↓
 *   section semantics
 *      ↓
 *   THIS FILE
 *
 * This module does not calculate astronomy.
 * It does not use Math.random().
 *
 * Same sign + date + interpretation = same prose.
 */

import {
  buildAllSectionSemantics,
} from "./section-signals.js";

import {
  interpretLoveSection,
} from "./sections/love.js";

/*
 * -------------------------------------------------------
 * DETERMINISTIC HASH
 * -------------------------------------------------------
 */

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash =
      ((hash << 5) - hash) +
      value.charCodeAt(i);

    hash |= 0;
  }

  return Math.abs(hash);
}

/*
 * Select one approved variation deterministically.
 */
function chooseVariation(
  variations,
  seed
) {
  if (
    !Array.isArray(variations) ||
    variations.length === 0
  ) {
    return "";
  }

  const index =
    hashString(seed) %
    variations.length;

  return variations[index];
}

/*
 * -------------------------------------------------------
 * SECTION THEMES
 * -------------------------------------------------------
 *
 * These sentences intentionally correspond to the
 * semantic vocabulary defined in section-signals.js.
 *
 * They are interpretation templates, not astronomy.
 * -------------------------------------------------------
 */

const SECTION_THEME_PROSE = {

  /*
   * -----------------------------------------------------
   * LOVE
   * -----------------------------------------------------
   */

  love: {

    connection: [
      "Warmth and genuine attention can strengthen an important connection.",
      "A thoughtful approach can create more harmony in an important relationship.",
    ],

    relationship_boundaries: [
      "Healthy boundaries can protect a relationship from unnecessary strain.",
      "A little more clarity about personal limits can make relationships easier to navigate.",
    ],

    emotional_closeness: [
      "Emotional openness can make an important connection feel more secure.",
      "Sharing feelings honestly can create greater closeness today.",
    ],

    emotional_sensitivity: [
      "Sensitive moments are easier to handle when you avoid rushing to conclusions.",
      "Give emotional reactions time to settle before deciding what they mean.",
    ],

    passion: [
      "Passion can add warmth and momentum to your closest connection.",
      "Strong attraction can bring energy and spontaneity into relationships.",
    ],

    relationship_friction: [
      "Tension can rise quickly if frustration is allowed to speak first.",
      "Give disagreements room to cool before trying to resolve them.",
    ],

    deep_transformation: [
      "An honest look at what you truly need can deepen an important relationship.",
      "A relationship may benefit from letting an old pattern change.",
    ],

    intensity: [
      "Strong emotions may make small issues feel larger than they are.",
      "Avoid turning a temporary emotional reaction into a permanent conclusion.",
    ],

    romantic_imagination: [
      "Romantic imagination can add warmth and possibility to your connections.",
      "Gentle affection and shared dreams can bring people closer.",
    ],

    idealization: [
      "Keep expectations grounded so that imagination does not replace reality.",
      "Notice the difference between what you hope for and what is actually being offered.",
    ],

    confidence_in_relationships: [
      "Confidence can help you express what you genuinely want from a relationship.",
      "Being comfortable with yourself can make connection feel more natural.",
    ],

    self_focus: [
      "Make room for the other person's perspective instead of letting everything center on your own needs.",
      "A little more attention to the other person's experience can restore balance.",
    ],

    relationship_growth: [
      "A relationship can grow when both people are willing to meet each other halfway.",
      "Shared growth is easier when optimism is paired with genuine attention.",
    ],

    overexpectation: [
      "Avoid expecting a relationship to solve more than it reasonably can.",
      "Keep expectations realistic while allowing the connection to develop naturally.",
    ],

    commitment: [
      "Consistency and reliability can strengthen a serious relationship.",
      "Showing up steadily may matter more than making a dramatic gesture.",
    ],

    distance_or_limits: [
      "Temporary distance or limits may reveal what needs clearer commitment.",
      "Respecting boundaries can help a relationship develop at a healthier pace.",
    ],

    relationship_conversation: [
      "An honest conversation can clear up uncertainty and strengthen understanding.",
      "Clear communication can help both people feel heard.",
    ],

    misunderstanding: [
      "Check what was actually meant before reacting to an uncertain message.",
      "Small misunderstandings can grow when assumptions replace direct conversation.",
    ],

    fresh_connection: [
      "A fresh interaction could introduce an interesting new dynamic.",
      "An unexpected connection may open a different way of relating.",
    ],

    unpredictability: [
      "Relationships may feel less predictable, so avoid forcing certainty too quickly.",
      "Leave some room for changing feelings and unexpected developments.",
    ],
  },

  /*
   * -----------------------------------------------------
   * CAREER
   * -----------------------------------------------------
   */

  career: {

    discipline: [
      "Steady effort and clear priorities can strengthen your professional position.",
      "Consistent work can produce more reliable results than trying to do everything at once.",
    ],

    restriction: [
      "External limits may require patience rather than confrontation.",
      "Progress may feel slower, but working within current constraints can prevent unnecessary setbacks.",
    ],

    professional_growth: [
      "Growth is favored when ambition is paired with good judgment.",
      "A useful professional opportunity can develop through steady expansion.",
    ],

    overextension: [
      "Avoid taking on more than you can realistically manage.",
      "Growth becomes less useful when enthusiasm pushes you beyond your practical limits.",
    ],

    leadership: [
      "Taking responsible initiative can strengthen your professional presence.",
      "A confident but measured approach can help others recognize your leadership.",
    ],

    ego_pressure: [
      "Avoid turning a professional disagreement into a question of pride.",
      "Results matter more than proving a point today.",
    ],

    initiative: [
      "Taking initiative can help move an important task forward.",
      "Direct action is useful when it is guided by a clear priority.",
    ],

    workplace_friction: [
      "Workplace frustration may rise if action becomes too forceful.",
      "Choose practical solutions over unnecessary confrontation.",
    ],

    planning_and_communication: [
      "Clear planning and communication can make today's work more efficient.",
      "Organizing information carefully can improve professional decisions.",
    ],

    communication_errors: [
      "Double-check important details before acting on workplace information.",
      "A small communication error could create avoidable complications.",
    ],

    innovation: [
      "A fresh approach could improve an established process.",
      "Innovation is useful when it solves a real practical problem.",
    ],

    unexpected_change: [
      "Unexpected changes may require you to adjust your professional plans.",
      "Stay flexible if circumstances shift without warning.",
    ],

    professional_transformation: [
      "A deeper change in your professional direction may be worth considering.",
      "An old working pattern may be ready for a more fundamental change.",
    ],

    power_struggles: [
      "Avoid unnecessary power struggles and focus on what actually needs to be accomplished.",
      "Professional tension becomes easier to manage when you avoid competing for control.",
    ],

    cooperation: [
      "Cooperation can make professional relationships more productive.",
      "Working with others rather than around them can improve results.",
    ],

    people_pleasing: [
      "Avoid agreeing to everything simply to keep others satisfied.",
      "Professional cooperation works best when your own limits are respected.",
    ],

    workplace_awareness: [
      "Pay attention to the atmosphere around you before choosing how to respond.",
      "Awareness of workplace dynamics can help you navigate the day smoothly.",
    ],

    emotional_work_pressure: [
      "Work pressure may feel more personal than it actually is.",
      "Give yourself space before allowing workplace stress to shape your decisions.",
    ],

    creative_work: [
      "Creative thinking can help you approach a professional problem differently.",
      "An imaginative solution may be useful where routine methods have stalled.",
    ],

    unclear_expectations: [
      "Unclear expectations could create unnecessary professional confusion.",
      "Ask for clarification before committing to work that lacks a clear direction.",
    ],
  },

  /*
   * -----------------------------------------------------
   * MONEY
   * -----------------------------------------------------
   */

  money: {

    financial_opportunity: [
      "Practical financial choices can create useful momentum.",
      "A useful financial opportunity may become easier to recognize today.",
    ],

    financial_overreach: [
      "Avoid stretching your resources simply to pursue a promising possibility.",
      "Keep financial ambition within limits that remain comfortable and realistic.",
    ],

    financial_discipline: [
      "Financial stability benefits from structure and disciplined planning.",
      "A careful approach to resources can strengthen your longer-term position.",
    ],

    financial_limits: [
      "Current financial limits may require patience and tighter priorities.",
      "Accepting practical limits now can prevent greater pressure later.",
    ],

    value_and_resources: [
      "Focus on value rather than impulse when deciding where resources should go.",
      "Thoughtful choices about what is genuinely worthwhile can improve financial balance.",
    ],

    unnecessary_spending: [
      "Avoid spending simply to satisfy a temporary desire.",
      "Pause before making purchases that are not clearly necessary or useful.",
    ],

    financial_planning: [
      "Careful planning can make financial decisions more manageable.",
      "Review important numbers and priorities before committing resources.",
    ],

    financial_miscommunication: [
      "Double-check financial information before making an important decision.",
      "Clarify terms and details before assuming everyone understands the same arrangement.",
    ],

    financial_restructuring: [
      "An old financial pattern may benefit from a more fundamental adjustment.",
      "Reorganizing resources could create greater long-term stability.",
    ],

    financial_intensity: [
      "Avoid allowing financial pressure to dominate an otherwise manageable situation.",
      "Strong concerns about money are easier to handle when decisions remain practical.",
    ],

    financial_confidence: [
      "Confidence can support sensible financial decisions when it is grounded in facts.",
      "Trust your ability to manage resources, but keep important choices practical.",
    ],

    ego_driven_spending: [
      "Avoid spending to prove a point or maintain an image.",
      "Financial choices are stronger when they reflect genuine priorities rather than pride.",
    ],

    decisive_action: [
      "A clear financial decision can create useful forward movement.",
      "Taking practical action may be better than leaving a manageable issue unresolved.",
    ],

    impulsive_action: [
      "Avoid making an important financial decision simply because you feel pressured to act.",
      "Give yourself time to reconsider before committing money impulsively.",
    ],

    financial_innovation: [
      "A new approach to managing resources may be worth exploring.",
      "An unconventional financial solution could become useful if tested carefully.",
    ],

    financial_unpredictability: [
      "Financial conditions may shift unexpectedly, so leave some room in your plans.",
      "Avoid relying on a financial outcome that is not yet certain.",
    ],

    financial_awareness: [
      "Paying closer attention to everyday financial details can reveal useful adjustments.",
      "Greater awareness of where resources are going can improve financial choices.",
    ],

    emotional_spending: [
      "Avoid using spending as a response to temporary emotions.",
      "Give yourself time to separate emotional wants from genuine financial needs.",
    ],

    creative_value: [
      "A creative idea could reveal value that is not immediately obvious.",
      "An imaginative approach may help you see a resource or opportunity differently.",
    ],

    financial_uncertainty: [
      "Keep financial expectations grounded while important details remain unclear.",
      "Avoid making firm assumptions about money until the relevant information is clearer.",
    ],
  },

  /*
   * -----------------------------------------------------
   * ENERGY
   * -----------------------------------------------------
   */

  energy: {

    motivation: [
      "Your motivation can be strong when you give it a clear direction.",
      "Focused action can help you make productive use of your energy.",
    ],

    frustration: [
      "Frustration can increase when action is rushed or blocked.",
      "Give yourself time to reassess before forcing the next step.",
    ],

    vitality: [
      "Your natural vitality can support steady progress when you avoid overextending yourself.",
      "You may have useful physical and mental momentum when your priorities remain clear.",
    ],

    ego_exhaustion: [
      "Trying to prove yourself may drain more energy than the task itself requires.",
      "Save your energy for what genuinely deserves your effort.",
    ],

    controlled_effort: [
      "Measured effort can be more effective than pushing continuously.",
      "Steady pacing can help you use your energy without wasting it.",
    ],

    fatigue_or_limits: [
      "Respect signs that your energy needs a slower pace.",
      "Current limits are easier to manage when you stop before exhaustion sets in.",
    ],

    spontaneous_energy: [
      "A sudden burst of energy may encourage you to try something different.",
      "Unexpected motivation could help break an unproductive routine.",
    ],

    restlessness: [
      "Restlessness may make it harder to stay with one task for long.",
      "Give excess energy a constructive outlet instead of reacting impulsively.",
    ],

    emotional_rhythm: [
      "Your energy may move with your emotional rhythm today.",
      "Allow your pace to adjust without letting temporary moods control the whole day.",
    ],

    mood_driven_energy: [
      "Energy may fluctuate with your mood, so avoid judging the whole day by one moment.",
      "A temporary emotional dip does not necessarily mean you lack the energy to continue.",
    ],

    enthusiasm: [
      "Enthusiasm can help you make meaningful progress.",
      "A positive burst of energy can be useful when directed toward a clear goal.",
    ],

    overdoing: [
      "Too much enthusiasm could lead you to overextend yourself.",
      "Know when enough effort is enough.",
    ],

    mental_activity: [
      "Mental activity may be high, making it easier to stay engaged with several ideas.",
      "Your mind may move quickly today, so give important tasks enough focus.",
    ],

    mental_overload: [
      "Too many thoughts competing for attention can make concentration harder.",
      "Simplifying your priorities can reduce unnecessary mental pressure.",
    ],

    focused_power: [
      "Focused energy can help you make meaningful progress on one important goal.",
      "Concentrated effort may be more productive than spreading yourself too thin.",
    ],

    intensity: [
      "Strong energy may need a constructive outlet rather than immediate reaction.",
      "Intensity can be productive when you give it a clear purpose.",
    ],

    ease_and_balance: [
      "A balanced pace can help you move through the day without unnecessary strain.",
      "Ease comes more naturally when you avoid forcing every result.",
    ],

    passivity: [
      "Too much comfort could make it easier to postpone action.",
      "A small deliberate step may be enough to restore momentum.",
    ],

    flow: [
      "Your energy may work best when you stop forcing the process.",
      "Allowing some flexibility in your pace can help things move more naturally.",
    ],

    low_clarity: [
      "Low clarity may make it harder to judge how much effort is enough.",
      "Pause when necessary rather than pushing ahead without a clear sense of direction.",
    ],
  },

  /*
   * -----------------------------------------------------
   * COMMUNICATION
   * -----------------------------------------------------
   */

  communication: {

    clear_expression: [
      "Clear expression can make important conversations easier today.",
      "Direct and thoughtful wording can reduce unnecessary confusion.",
    ],

    misunderstanding: [
      "Sensitive conversations may require more careful wording than usual.",
      "Check what was actually meant before reacting to an uncertain message.",
    ],

    directness: [
      "Direct communication can help move an important conversation forward.",
      "Say what you mean clearly while leaving room for the other person's perspective.",
    ],

    sharp_words: [
      "Strong reactions could turn ordinary disagreements into unnecessary conflict.",
      "Pause before speaking if frustration is already running high.",
    ],

    confidence_in_expression: [
      "Confidence can help you express your position without becoming defensive.",
      "Speak clearly about what you need while remaining open to another perspective.",
    ],

    ego_in_communication: [
      "Avoid turning a disagreement into a contest over who is right.",
      "Being heard matters, but listening may matter just as much today.",
    ],

    diplomacy: [
      "A diplomatic approach can help sensitive conversations land more constructively.",
      "Gentle wording can preserve cooperation without avoiding the real issue.",
    ],

    avoidance: [
      "Avoiding an important conversation may only postpone the issue.",
      "Address what needs to be said without creating unnecessary confrontation.",
    ],

    emotional_expression: [
      "Honest emotional expression can improve mutual understanding.",
      "Letting people know how you feel can make communication more genuine.",
    ],

    emotional_reactivity: [
      "Emotional reactions can easily shape the tone of a conversation.",
      "Give yourself time to settle before responding to something sensitive.",
    ],

    big_picture_thinking: [
      "Looking at the larger context can help you communicate more constructively.",
      "A broader perspective may reveal that the immediate issue is smaller than it first appears.",
    ],

    overstatement: [
      "Avoid promising more than you can realistically deliver.",
      "Keep important statements measured rather than overstated.",
    ],

    original_ideas: [
      "An original idea could change the direction of an important conversation.",
      "Fresh thinking may help you communicate something in a more effective way.",
    ],

    unexpected_messages: [
      "An unexpected message may require a little more thought before you respond.",
      "Leave room for new information to change the conversation.",
    ],

    careful_words: [
      "Careful wording can prevent a small issue from becoming a larger one.",
      "Choose your words deliberately when the subject matters.",
    ],

    communication_blocks: [
      "Communication may feel slower than usual, so allow extra time for clarification.",
      "Do not assume silence means agreement or understanding.",
    ],

    intuition: [
      "Your intuition may help you notice what is left unsaid.",
      "Pay attention to tone as well as the literal words being used.",
    ],

    unclear_messages: [
      "Unclear messages should be checked rather than interpreted too quickly.",
      "Ask a direct question if something does not make sense.",
    ],

    deep_conversation: [
      "A deeper conversation could reveal something important beneath the surface.",
      "Honest discussion may bring greater clarity to an important subject.",
    ],

    intense_exchange: [
      "Conversations may become intense quickly if neither side gives enough space.",
      "Keep difficult exchanges measured rather than trying to win the moment.",
    ],
  },

  /*
   * -----------------------------------------------------
   * EMOTIONAL
   * -----------------------------------------------------
   */

  emotional: {

    emotional_awareness: [
      "Give feelings room without allowing temporary moods to define the whole day.",
      "Greater awareness of your feelings can help you respond rather than react.",
    ],

    emotional_reactivity: [
      "Avoid allowing emotional reactions to make decisions for you.",
      "Give strong feelings time to settle before deciding what they require.",
    ],

    intuition: [
      "Your intuition may offer useful information when you give yourself quiet space to notice it.",
      "Pay attention to subtle feelings without treating every impression as certainty.",
    ],

    uncertainty: [
      "Not every feeling needs an immediate explanation.",
      "Allow uncertainty to remain for a while instead of forcing an answer.",
    ],

    emotional_transformation: [
      "An old emotional pattern may be ready for a healthier response.",
      "Something beneath the surface may be changing in a way that ultimately brings greater clarity.",
    ],

    emotional_intensity: [
      "Strong feelings may make situations seem more urgent than they really are.",
      "Give intense emotions room without letting them dictate every decision.",
    ],

    emotional_harmony: [
      "Warmth and emotional balance can make the day feel easier.",
      "A little kindness toward yourself and others can restore emotional harmony.",
    ],

    emotional_attachment: [
      "Notice where attachment may be making it harder to accept what is changing.",
      "Allow connection without trying to control the outcome.",
    ],

    self_awareness: [
      "Greater awareness of your own needs can help you respond more thoughtfully.",
      "Take time to notice what is genuinely important to you.",
    ],

    self_consciousness: [
      "Do not let concern about how you are perceived become larger than the situation itself.",
      "You may be judging yourself more harshly than others are.",
    ],

    emotional_optimism: [
      "A more hopeful emotional perspective can help you see beyond a temporary difficulty.",
      "Give yourself permission to believe that circumstances can improve.",
    ],

    emotional_excess: [
      "Positive feelings can still become excessive when they override practical judgment.",
      "Stay grounded even when optimism is strong.",
    ],

    emotional_stability: [
      "Simple routines and steady responses can support emotional stability.",
      "Consistency can help you feel more grounded when circumstances shift.",
    ],

    emotional_reserve: [
      "It may take time before you feel ready to share everything openly.",
      "Do not force emotional openness before you are genuinely comfortable with it.",
    ],

    emotional_drive: [
      "Strong feelings can provide motivation when directed toward something constructive.",
      "Emotional energy can become useful momentum when given a clear purpose.",
    ],

    irritability: [
      "Small frustrations may feel sharper than usual, so create space before responding.",
      "A short pause can prevent irritation from shaping the entire interaction.",
    ],

    emotional_understanding: [
      "Putting feelings into words can help you understand what is really happening.",
      "Thoughtful reflection can bring clarity to an emotional situation.",
    ],

    overthinking: [
      "Too much analysis can make a simple emotional issue feel more complicated.",
      "Give yourself permission to step away from repetitive thoughts.",
    ],

    emotional_freedom: [
      "Allowing yourself more emotional space can make the day feel lighter.",
      "You do not need to respond to every feeling immediately.",
    ],

    emotional_unpredictability: [
      "Emotions may change quickly, so avoid treating one moment as the final answer.",
      "Give yourself room to adjust as your feelings develop.",
    ],
  },

  /*
   * -----------------------------------------------------
   * OPPORTUNITY
   * -----------------------------------------------------
   */

  opportunity: {

    expansion: [
      "A broader perspective can reveal worthwhile possibilities.",
      "The day has room for growth if you remain open to useful possibilities.",
    ],

    overreach: [
      "An attractive possibility may require more restraint than immediate expansion.",
      "Do not confuse a promising opening with a reason to overextend yourself.",
    ],

    unexpected_opening: [
      "An unexpected opening could become useful if you remain flexible.",
      "Something outside your original plan may deserve a closer look.",
    ],

    unstable_opportunity: [
      "An opportunity may be less stable than it first appears, so keep your options open.",
      "Stay flexible when an attractive possibility depends on changing circumstances.",
    ],

    cooperation: [
      "Cooperation can turn a small opening into something more useful.",
      "Working with the right people may strengthen an emerging opportunity.",
    ],

    dependence_on_others: [
      "Do not make an opportunity entirely dependent on someone else's response.",
      "Keep your own options open while allowing others time to contribute.",
    ],

    confidence: [
      "Confidence can help you recognize an opportunity without overcomplicating the choice.",
      "Trust your ability to move forward while keeping your expectations realistic.",
    ],

    overconfidence: [
      "Confidence is useful, but leave room for information you do not yet have.",
      "Avoid assuming that a promising opening guarantees an easy result.",
    ],

    useful_information: [
      "A useful piece of information could make an opportunity easier to recognize.",
      "Pay attention to practical details that may reveal where an opening exists.",
    ],

    missed_details: [
      "An opportunity could be weakened if important details are overlooked.",
      "Slow down enough to check the information behind an attractive possibility.",
    ],

    initiative: [
      "A timely first step can help turn possibility into progress.",
      "Taking practical initiative may be more useful than waiting for perfect certainty.",
    ],

    rushed_action: [
      "An opportunity does not necessarily require an immediate decision.",
      "Give yourself enough time to distinguish a real opening from a momentary impulse.",
    ],

    long_term_value: [
      "An opportunity becomes more valuable when it supports your longer-term priorities.",
      "Look beyond immediate results when deciding which possibility deserves attention.",
    ],

    delayed_results: [
      "A worthwhile opportunity may take longer to produce visible results.",
      "Do not dismiss a useful possibility simply because the payoff is not immediate.",
    ],

    deep_change: [
      "A deeper change could open a path that was not previously available.",
      "An important opportunity may involve changing an old approach rather than adding something new.",
    ],

    high_stakes_change: [
      "A major opportunity may also carry significant consequences, so consider the stakes carefully.",
      "Big changes deserve a clear understanding of what you are willing to risk.",
    ],

    inspiration: [
      "An inspiring idea could point toward a useful possibility.",
      "Let inspiration guide exploration, while practical details guide commitment.",
    ],

    unclear_potential: [
      "A possibility may look appealing before its full potential is clear.",
      "Give promising ideas time to reveal whether they can work in practice.",
    ],

    timely_instinct: [
      "A timely instinct may help you notice an opening before it becomes obvious.",
      "Trust a useful first impression, then check it against the facts.",
    ],

    changing_moods: [
      "Changing moods may affect how attractive an opportunity appears.",
      "Wait for a steadier perspective before making an important choice.",
    ],
  },

  /*
   * -----------------------------------------------------
   * GUIDANCE
   * -----------------------------------------------------
   */

  guidance: {

    discipline: [
      "Discipline can turn steady effort into lasting progress.",
      "A structured approach can help you make the most of the day.",
    ],

    patience: [
      "Patience may be more productive than trying to force an immediate result.",
      "Let circumstances develop before deciding that action is required.",
    ],

    perspective: [
      "A broader perspective can help you distinguish what matters from what merely feels urgent.",
      "Step back far enough to see the larger pattern before choosing your next move.",
    ],

    moderation: [
      "Keep enthusiasm and caution in balance rather than leaning too far toward either.",
      "Moderation can help you make a better decision while circumstances remain changeable.",
    ],

    emotional_awareness: [
      "Stay aware of your feelings without allowing them to make every decision.",
      "Notice emotional reactions first, then decide how much weight they deserve.",
    ],

    emotional_patience: [
      "Give feelings time to develop before deciding what they mean.",
      "A little emotional distance can make today's choices clearer.",
    ],

    decisive_action: [
      "When the path is clear, a deliberate decision can move things forward.",
      "Do not confuse patience with inaction when a useful next step is obvious.",
    ],

    restraint: [
      "Restraint can prevent temporary frustration from becoming an unnecessary setback.",
      "Knowing when not to push may be the most productive choice today.",
    ],

    clarity: [
      "Keep important decisions clear and straightforward.",
      "Simple, direct thinking can prevent unnecessary complications.",
    ],

    verification: [
      "Double-check important details before reacting or committing.",
      "Verification can prevent a small misunderstanding from becoming a larger problem.",
    ],

    self_trust: [
      "Trust your judgment while remaining willing to reconsider when new information appears.",
      "Confidence is strongest when it remains open to evidence.",
    ],

    humility: [
      "Stay confident without assuming you already have the complete picture.",
      "Humility can make it easier to recognize useful information from others.",
    ],

    cooperation: [
      "Cooperation can make today's challenges easier to navigate.",
      "Leave room for other people to contribute rather than carrying everything alone.",
    ],

    balance: [
      "Balance is more useful than reacting to either extreme.",
      "Look for a middle path that respects both your needs and the situation around you.",
    ],

    flexibility: [
      "Stay open to changing your approach if circumstances shift.",
      "Flexibility can turn an unexpected development into something manageable.",
    ],

    adaptability: [
      "Adaptability will be more useful than trying to control every detail.",
      "Allow your plan to evolve when circumstances give you new information.",
    ],

    intuition: [
      "Give your intuition a place in the decision, but let practical facts complete the picture.",
      "A quiet instinct may be useful when combined with clear judgment.",
    ],

    clarity: [
      "Seek clarity before treating uncertainty as a final answer.",
      "When something feels unclear, ask rather than assume.",
    ],

    transformation: [
      "An old approach may need to change before progress can continue.",
      "Allow useful change to replace patterns that are no longer helping.",
    ],

    release: [
      "Let go of what no longer needs to control your attention.",
      "Releasing an outdated expectation can create room for a better direction.",
    ],
  },
};

/*
 * -------------------------------------------------------
 * FALLBACK PROSE
 * -------------------------------------------------------
 */
/*
 * -------------------------------------------------------
 * LOVE-SPECIFIC PROSE — V2.2
 * -------------------------------------------------------
 *
 * This vocabulary translates structured Love Engine
 * dimensions into reader-facing language.
 *
 * IMPORTANT:
 *   This layer does not calculate meaning.
 *   It only expresses meaning already determined by
 *   love.js.
 * -------------------------------------------------------
 */

const LOVE_PROSE = {

  affection: {
    supportive: [
      "Warmth and genuine affection can come through naturally today.",
      "Small gestures of care can strengthen an important connection.",
      "Affection is easier to express when you allow yourself to be present and attentive."
    ],

    challenging: [
      "Affection may need more deliberate expression today.",
      "Relationship warmth can benefit from patience rather than assumption.",
      "Small emotional distances are easier to close when care is shown directly."
    ],

    balanced: [
      "Affection is best expressed through simple, genuine attention.",
      "A steady and thoughtful approach can keep emotional warmth balanced.",
      "Let affection develop naturally without trying to force a particular response."
    ]
  },

  emotionalCloseness: {
    supportive: [
      "Emotional openness can make an important connection feel more secure.",
      "Sharing feelings honestly can create greater closeness today.",
      "There is room for deeper emotional understanding when you listen as carefully as you speak."
    ],

    challenging: [
      "Emotions may feel more sensitive than usual, so give important conversations room to unfold.",
      "A strong reaction does not necessarily tell the whole story of a relationship.",
      "Emotional closeness may require patience before either person feels fully understood."
    ],

    balanced: [
      "Emotional closeness grows through steady attention rather than pressure.",
      "Give both yourself and the other person enough space to process what is being felt.",
      "A calm exchange can reveal more than an immediate reaction."
    ]
  },

  attraction: {
    supportive: [
      "Attraction can feel more natural and noticeable today.",
      "There can be a stronger sense of chemistry and romantic momentum.",
      "Passion has room to grow when confidence is balanced with consideration."
    ],

    challenging: [
      "Strong attraction can also bring impatience or friction if emotions move faster than understanding.",
      "Chemistry may be intense, so avoid letting impulse make important relationship decisions for you.",
      "Passion benefits from restraint when frustration and desire become closely linked."
    ],

    balanced: [
      "Attraction may be present without needing to define the entire relationship.",
      "Let chemistry develop at its own pace rather than forcing certainty.",
      "A measured approach can keep attraction exciting without making it overwhelming."
    ]
  },

  intimacy: {
    supportive: [
      "Deeper trust can make intimacy feel more natural.",
      "Honest vulnerability can strengthen an important bond.",
      "There is room to move beyond surface-level connection and understand what really matters."
    ],

    challenging: [
      "Intimacy may bring deeper feelings to the surface, so avoid trying to control every emotional response.",
      "Vulnerability can feel uncomfortable when trust has not fully caught up with desire.",
      "Give deeper relationship matters time rather than demanding immediate certainty."
    ],

    balanced: [
      "Intimacy develops best when trust and vulnerability are allowed to grow together.",
      "A quieter, more honest exchange may reveal what deeper connection actually requires.",
      "Let closeness develop through consistency rather than pressure."
    ]
  },

  romance: {
    supportive: [
      "Romantic energy can add warmth and possibility to your connections.",
      "Shared dreams, affection and thoughtful gestures can make relationships feel more meaningful.",
      "There is room for romantic expression when imagination is supported by genuine connection."
    ],

    challenging: [
      "Romantic expectations may need to stay grounded in what is actually being offered.",
      "Imagination can be powerful, but it helps to distinguish hope from evidence.",
      "Avoid allowing an idealized picture of a relationship to overshadow what is happening in reality."
    ],

    balanced: [
      "Romance benefits from balancing imagination with realistic expectations.",
      "Enjoy the emotional possibilities without deciding too quickly what they must mean.",
      "A grounded romantic approach can leave room for both affection and reality."
    ]
  },

  communication: {
    supportive: [
      "Open conversation can make it easier to understand what each person actually needs.",
      "Honest communication can clear up uncertainty and strengthen connection.",
      "Listening carefully can turn an ordinary conversation into a meaningful point of connection."
    ],

    challenging: [
      "Communication may require extra care, especially when emotions are already running high.",
      "Pause before reacting to words that may have been interpreted more strongly than intended.",
      "A difficult conversation can improve when you ask for clarity instead of filling gaps with assumptions."
    ],

    balanced: [
      "Clear and patient communication can keep relationships on steady ground.",
      "Say what you mean while leaving enough space to hear the other person's perspective.",
      "A measured conversation can prevent small uncertainties from becoming larger issues."
    ]
  },

  commitment: {
    supportive: [
      "Consistency can strengthen trust and give an important relationship a stronger foundation.",
      "A willingness to show up reliably can support long-term relationship growth.",
      "Commitment feels stronger when intentions are matched by steady actions."
    ],

    challenging: [
      "Questions about commitment may benefit from patience rather than immediate conclusions.",
      "Responsibility or distance may make relationship expectations feel heavier than usual.",
      "Give long-term decisions enough time to separate genuine commitment from temporary pressure."
    ],

    balanced: [
      "Commitment is best measured through consistency rather than promises alone.",
      "Let long-term expectations develop at a pace that feels realistic for both people.",
      "A balanced approach can protect stability without making the relationship feel overly controlled."
    ]
  }

};

/*
 * -------------------------------------------------------
 * LOVE DIMENSION HELPERS
 * -------------------------------------------------------
 */

const LOVE_DIMENSION_ORDER = [
  "affection",
  "emotionalCloseness",
  "attraction",
  "intimacy",
  "romance",
  "communication",
  "commitment",
];

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const LOVE_DIMENSION_LABELS = {
  affection: "affection",
  emotionalCloseness: "emotional closeness",
  attraction: "attraction",
  intimacy: "intimacy",
  romance: "romance",
  communication: "communication",
  commitment: "commitment",
};

function loveDimensionSentence(
  dimensionName,
  dimension,
  seed
) {
  if (!dimension) {
    return "";
  }

  const influence =
    dimension.influence === "supportive"
      ? "supportive"
      : dimension.influence === "challenging"
        ? "challenging"
        : "balanced";

  const variants =
    LOVE_PROSE[dimensionName]?.[influence];

  return chooseVariation(
    variants,
    `${seed}:${dimensionName}:${influence}`
  );
}

function loveOpening(
  love,
  seed
) {
  const dynamic =
    love.relationshipDynamic?.type;

  const weather =
    love.relationshipWeather?.tone;

  if (dynamic === "supportive") {
    return chooseVariation(
      [
        "Relationships have a generally constructive tone today, with several areas supporting connection and growth.",
        "The relationship picture is encouraging today, especially where warmth, attraction and consistency are allowed to work together.",
      ],
      `${seed}:love:opening:supportive`
    );
  }

  if (dynamic === "challenging") {
    return chooseVariation(
      [
        "Relationships may require more patience today, particularly where emotional or romantic expectations are involved.",
        "The relationship picture calls for care today, with some areas asking for patience before conclusions are drawn.",
      ],
      `${seed}:love:opening:challenging`
    );
  }

  if (weather === "challenging" ||
      weather === "mildly_challenging") {
    return chooseVariation(
      [
        "Relationships can still move forward today, although the broader emotional climate rewards patience and careful communication.",
        "The relationship picture is mixed today, with a generally active emotional climate making calm communication especially useful.",
      ],
      `${seed}:love:opening:weather`
    );
  }

  return chooseVariation(
    [
      "Relationships benefit from a calm balance of openness, affection and realistic expectations today.",
      "The relationship picture is mixed but manageable, with different areas calling for different kinds of attention.",
    ],
    `${seed}:love:opening:balanced`
  );
}

function loveStrongestAreaSentence(
  love,
  seed
) {
  const strongest =
    love.strongestDimension;

  if (!strongest?.dimension) {
    return "";
  }

  const label =
    LOVE_DIMENSION_LABELS[
      strongest.dimension
    ] ?? strongest.dimension;

  if (strongest.influence === "supportive") {
    return chooseVariation(
      [
        `The strongest relationship theme today is ${label}, making this an especially useful area for positive connection.`,
        `${capitalize(label)} stands out as the strongest relationship theme today, giving you something constructive to build on.`,
      ],
      `${seed}:love:strongest:${strongest.dimension}:supportive`
    );
  }

  if (strongest.influence === "challenging") {
    return chooseVariation(
      [
        `${capitalize(label)} is the area most likely to require patience today.`,
        `The greatest relationship pressure is around ${label}, so a slower and more thoughtful approach may help.`,
      ],
      `${seed}:love:strongest:${strongest.dimension}:challenging`
    );
  }

  return chooseVariation(
    [
      `${capitalize(label)} deserves particular attention today, although it does not need to become a source of concern.`,
      `${capitalize(label)} is the most noticeable relationship theme today, but it remains manageable with awareness.`,
    ],
    `${seed}:love:strongest:${strongest.dimension}:balanced`
  );
}

const LOVE_PLANET_LABELS = {
  Sun: "the Sun",
  Moon: "the Moon",
  Mercury: "Mercury",
  Venus: "Venus",
  Mars: "Mars",
  Jupiter: "Jupiter",
  Saturn: "Saturn",
  Uranus: "Uranus",
  Neptune: "Neptune",
  Pluto: "Pluto",
};

function lovePlanetSentence(
  love,
  seed
) {
  const planet =
    love.strongestPlanet;

  if (!planet?.planet) {
    return "";
  }

  const name =
     LOVE_PLANET_LABELS[planet.planet] ??
    planet.planet;

  if (planet.influence === "supportive") {
    return chooseVariation(
      [
        `${name} is the strongest supportive influence in the relationship picture, emphasizing its themes of ${planet.theme ?? "connection"}.`,
        `The relationship picture is particularly responsive to ${name}, whose influence supports ${planet.theme ?? "connection"} today.`,
      ],
      `${seed}:love:planet:${planet.planet}:supportive`
    );
  }

  if (planet.influence === "challenging") {
    return chooseVariation(
      [
        `${name} carries the strongest challenging influence in the relationship picture, so its themes deserve extra awareness.`,
        `${name} is the most significant source of relationship pressure today, making patience around its themes especially useful.`,
      ],
      `${seed}:love:planet:${planet.planet}:challenging`
    );
  }

  return "";
}

function loveWeatherSentence(
  love,
  seed
) {
  const weather =
    love.relationshipWeather;

  if (!weather) {
    return "";
  }

  const aspect =
    weather.strongestAspect;

  if (!aspect?.planets?.length) {
    return "";
  }

  const pair =
    aspect.planets
      .map(
        planet =>
          LOVE_PLANET_LABELS[planet] ?? planet
      )
      .join("–");

  const aspectName =
    aspect.aspect?.toLowerCase();

  if (aspectName === "square") {
    return chooseVariation(
      [
        `The broader relationship climate carries some friction through the ${pair} square, so patience can prevent temporary tension from becoming a larger issue.`,
        `A ${pair} square adds some shared relationship pressure today, making flexibility more useful than forcing an immediate resolution.`,
      ],
      `${seed}:love:weather:square`
    );
  }

  if (
    aspectName === "trine" ||
    aspectName === "sextile"
  ) {
    return chooseVariation(
      [
        `The broader relationship climate is helped by the ${pair} ${aspectName}, which supports easier cooperation.`,
        `A ${pair} ${aspectName} adds a constructive undertone to relationships today.`,
      ],
      `${seed}:love:weather:${aspectName}`
    );
  }

  if (aspectName === "opposition") {
    return chooseVariation(
      [
        `The ${pair} opposition highlights a shared need to balance competing relationship needs.`,
        `A ${pair} opposition makes balance especially useful in the broader relationship climate.`,
      ],
      `${seed}:love:weather:opposition`
    );
  }

  if (aspectName === "conjunction") {
    return chooseVariation(
      [
        `The ${pair} conjunction makes relationship themes especially noticeable today.`,
        `A ${pair} conjunction intensifies the broader relationship atmosphere.`,
      ],
      `${seed}:love:weather:conjunction`
    );
  }

  return "";
} 

/*
 * -------------------------------------------------------
 * LOVE-SPECIFIC PROSE GENERATOR
 * -------------------------------------------------------
 */

function generateLoveProse(
  sunSign,
  interpretation,
  dateUTC,
  seed,
  loveSource = null
) {
  /*
   * The Love engine consumes the rich planetary
   * interpretations and aspect signals.
   *
   * prose.js does NOT calculate the Love interpretation.
   */
  const love =
    interpretLoveSection({
      sunSign,

      interpretations:
        loveSource?.interpretations ??
        [],

      aspectSignals:
        loveSource?.aspectSignals ??
        []
    });

      

  const parts = [];

  /*
   * 1. Opening
   */
  parts.push(
    loveOpening(
      love,
      seed
    )
  );

  /*
   * 2. Strongest relationship dimension
   */
  parts.push(
    loveStrongestAreaSentence(
      love,
      seed
    )
  );

  /*
   * 3. Two strongest dimensions
   *
   * We deliberately do not print all seven dimensions.
   * The engine uses all seven, but prose selects the
   * most meaningful ones for readability.
   */
  const rankedDimensions =
    LOVE_DIMENSION_ORDER
      .map(name => ({
        name,
        dimension:
          love.dimensions?.[name]
      }))
      .filter(item =>
        item.dimension &&
        Number.isFinite(
          item.dimension.score
        )
      )
      .sort(
        (a, b) =>
          Math.abs(b.dimension.score) -
          Math.abs(a.dimension.score)
      );

  const selectedDimensions =
    rankedDimensions.slice(0, 2);

  for (const item of selectedDimensions) {
    const sentence =
      loveDimensionSentence(
        item.name,
        item.dimension,
        seed
      );

    if (sentence) {
      parts.push(sentence);
    }
  }

  /*
   * 4. Communication is important enough to receive
   *    special treatment when it is not already one of
   *    the strongest dimensions.
   */
  const communication =
    love.dimensions?.communication;

  if (
    communication &&
    !selectedDimensions.some(
      item =>
        item.name === "communication"
    )
  ) {
    const communicationSentence =
      loveDimensionSentence(
        "communication",
        communication,
        `${seed}:secondary`
      );

    if (communicationSentence) {
      parts.push(
        communicationSentence
      );
    }
  }

  /*
   * 5. Strongest planetary influence
   */
  const planetSentence =
    lovePlanetSentence(
      love,
      seed
    );

  if (planetSentence) {
    parts.push(
      planetSentence
    );
  }

  /*
   * 6. Shared relationship weather
   */
  const weatherSentence =
    loveWeatherSentence(
      love,
      seed
    );

  if (weatherSentence) {
    parts.push(
      weatherSentence
    );
  }

  /*
   * Remove exact duplicate sentences.
   */
  return [
    ...new Set(
      parts.filter(Boolean)
    )
  ].join(" ");
}


const FALLBACK_THEMES = {
  supportive: [
    "A constructive approach can help you make useful progress today.",
    "Steady attention to what matters most can create forward movement.",
  ],

  challenging: [
    "Some pressure may require patience and careful judgment today.",
    "A slower and more deliberate approach may produce better results.",
  ],

  balanced: [
    "The day benefits from staying measured and paying attention to what develops.",
    "Neither excessive caution nor excessive confidence is necessary today.",
  ],
};

/*
 * -------------------------------------------------------
 * ASPECT LANGUAGE
 * -------------------------------------------------------
 */

const ASPECT_PROSE = {

  Trine: [
    "{a} and {b} trine creates an easier path forward.",
    "{a} and {b} trine adds a supportive undertone to this area.",
  ],

  Sextile: [
    "{a} and {b} sextile offers a useful opening when you act deliberately.",
    "{a} and {b} sextile supports constructive movement in this area.",
  ],

  Square: [
    "{a} and {b} square can create friction that rewards patience.",
    "{a} and {b} square may require flexibility and careful timing.",
  ],

  Opposition: [
    "{a} and {b} opposition can highlight a tension that needs balance.",
    "{a} and {b} opposition suggests avoiding unnecessary extremes.",
  ],

  Conjunction: [
    "{a} and {b} conjunction intensifies the themes already present.",
    "{a} and {b} conjunction can make this area feel especially noticeable.",
  ],
};

/*
 * -------------------------------------------------------
 * SECTION-AWARE ASPECT LANGUAGE — V3
 * -------------------------------------------------------
 */

const SECTION_ASPECT_PROSE = {

  overview: {
    Trine: [
      "{a} and {b} trine supports steady forward movement.",
      "{a} and {b} trine adds constructive momentum to the day.",
    ],

    Sextile: [
      "{a} and {b} sextile creates a useful opening for deliberate action.",
      "{a} and {b} sextile supports progress when you use the opportunity well.",
    ],

    Square: [
      "{a} and {b} square can create friction that rewards patience.",
      "{a} and {b} square suggests flexibility may be more useful than force.",
    ],

    Opposition: [
      "{a} and {b} opposition highlights an area where balance matters.",
      "{a} and {b} opposition suggests avoiding unnecessary extremes.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies the themes already present.",
      "{a} and {b} conjunction makes this influence especially noticeable.",
    ],
  },

  love: {
    Trine: [
      "{a} and {b} trine supports greater harmony in relationships.",
      "{a} and {b} trine makes cooperation and understanding easier.",
    ],

    Sextile: [
      "{a} and {b} sextile creates an opening for constructive connection.",
      "{a} and {b} sextile supports honest and productive interaction.",
    ],

    Square: [
      "{a} and {b} square may create relationship friction that rewards patience.",
      "{a} and {b} square suggests giving sensitive situations more space.",
    ],

    Opposition: [
      "{a} and {b} opposition can highlight the need for balance between two needs.",
      "{a} and {b} opposition suggests avoiding unnecessary relationship extremes.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies relationship themes.",
      "{a} and {b} conjunction can make connection matters especially noticeable.",
    ],
  },

  career: {
    Trine: [
      "{a} and {b} trine supports steady professional progress.",
      "{a} and {b} trine favors combining growth with practical structure.",
    ],

    Sextile: [
      "{a} and {b} sextile creates a useful opening for constructive action.",
      "{a} and {b} sextile supports progress through good planning and timing.",
    ],

    Square: [
      "{a} and {b} square may create professional friction that requires patience.",
      "{a} and {b} square suggests adjusting your approach rather than forcing results.",
    ],

    Opposition: [
      "{a} and {b} opposition may require balancing competing professional priorities.",
      "{a} and {b} opposition suggests avoiding unnecessary conflict over direction.",
    ],

    Conjunction: [
      "{a} and {b} conjunction makes professional priorities especially noticeable.",
      "{a} and {b} conjunction intensifies the work-related themes already present.",
    ],
  },

  money: {
    Trine: [
      "{a} and {b} trine supports practical financial progress.",
      "{a} and {b} trine favors combining opportunity with sensible planning.",
    ],

    Sextile: [
      "{a} and {b} sextile can reveal a useful financial opening.",
      "{a} and {b} sextile supports practical movement when details are checked.",
    ],

    Square: [
      "{a} and {b} square suggests caution around financial pressure.",
      "{a} and {b} square can make restraint more useful than rushing a decision.",
    ],

    Opposition: [
      "{a} and {b} opposition highlights the need to balance risk and security.",
      "{a} and {b} opposition suggests avoiding financial extremes.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies financial themes already present.",
      "{a} and {b} conjunction can make financial priorities especially noticeable.",
    ],
  },

  energy: {
    Trine: [
      "{a} and {b} trine supports a more manageable flow of energy.",
      "{a} and {b} trine makes steady effort easier to sustain.",
    ],

    Sextile: [
      "{a} and {b} sextile creates a useful opening for directed action.",
      "{a} and {b} sextile supports productive use of available energy.",
    ],

    Square: [
      "{a} and {b} square can create pressure that rewards better pacing.",
      "{a} and {b} square suggests slowing down before forcing the next step.",
    ],

    Opposition: [
      "{a} and {b} opposition may pull your energy in competing directions.",
      "{a} and {b} opposition suggests finding a workable middle pace.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies the day's energy.",
      "{a} and {b} conjunction can make this influence especially strong.",
    ],
  },

  communication: {
    Trine: [
      "{a} and {b} trine supports clearer and more constructive communication.",
      "{a} and {b} trine makes cooperation easier when ideas are expressed openly.",
    ],

    Sextile: [
      "{a} and {b} sextile supports useful conversations and practical exchanges.",
      "{a} and {b} sextile creates an opening for clearer communication.",
    ],

    Square: [
      "{a} and {b} square can make conversations more reactive than intended.",
      "{a} and {b} square suggests checking your wording before responding.",
    ],

    Opposition: [
      "{a} and {b} opposition can create tension between different viewpoints.",
      "{a} and {b} opposition suggests listening as carefully as you speak.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies communication themes.",
      "{a} and {b} conjunction makes conversations especially significant.",
    ],
  },

  emotional: {
    Trine: [
      "{a} and {b} trine supports greater emotional steadiness.",
      "{a} and {b} trine can make emotional understanding easier.",
    ],

    Sextile: [
      "{a} and {b} sextile creates room for constructive emotional movement.",
      "{a} and {b} sextile supports responding thoughtfully to feelings.",
    ],

    Square: [
      "{a} and {b} square may increase emotional sensitivity.",
      "{a} and {b} square suggests giving strong feelings time to settle.",
    ],

    Opposition: [
      "{a} and {b} opposition can highlight competing emotional needs.",
      "{a} and {b} opposition suggests allowing room for both sides of a feeling.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies the emotional themes of the day.",
      "{a} and {b} conjunction can make feelings especially noticeable.",
    ],
  },

  opportunity: {
    Trine: [
      "{a} and {b} trine creates a supportive path for useful opportunities.",
      "{a} and {b} trine strengthens the potential for constructive progress.",
    ],

    Sextile: [
      "{a} and {b} sextile can create an opening worth exploring.",
      "{a} and {b} sextile supports taking advantage of a practical possibility.",
    ],

    Square: [
      "{a} and {b} square suggests that useful opportunities may require patience.",
      "{a} and {b} square can make timing and flexibility especially important.",
    ],

    Opposition: [
      "{a} and {b} opposition suggests weighing competing possibilities carefully.",
      "{a} and {b} opposition can make balance important when choosing an opportunity.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies the opportunities already developing.",
      "{a} and {b} conjunction can make an emerging possibility especially noticeable.",
    ],
  },

  guidance: {
    Trine: [
      "{a} and {b} trine creates an easier path when growth is combined with discipline.",
      "{a} and {b} trine supports a balanced and constructive approach.",
    ],

    Sextile: [
      "{a} and {b} sextile suggests using available opportunities deliberately.",
      "{a} and {b} sextile supports practical action without unnecessary pressure.",
    ],

    Square: [
      "{a} and {b} square suggests patience and flexibility rather than force.",
      "{a} and {b} square reminds you to adjust your approach when pressure rises.",
    ],

    Opposition: [
      "{a} and {b} opposition suggests finding balance before committing to either extreme.",
      "{a} and {b} opposition makes moderation especially useful.",
    ],

    Conjunction: [
      "{a} and {b} conjunction intensifies the lesson already present in the day.",
      "{a} and {b} conjunction makes this theme difficult to overlook.",
    ],
  },
};
/*
 * -------------------------------------------------------
 * ASPECT SELECTION
 * -------------------------------------------------------
 */
function aspectSentence(
  aspect,
  section,
  seed
) {
  if (!aspect) {
    return "";
  }

  const sectionLanguage =
    SECTION_ASPECT_PROSE[section];

  const templates =
    sectionLanguage?.[aspect.aspect] ??
    ASPECT_PROSE[aspect.aspect];

  if (!templates) {
    return "";
  }

  const template =
    chooseVariation(
      templates,
      seed
    );

  const planetA =
    aspect.planets?.[0];

  const planetB =
    aspect.planets?.[1];

  if (!planetA || !planetB) {
    return "";
  }

  const aspectName =
    aspect.aspect;

  /*
   * V4.2:
   * Convert the internal template form:
   *
   *   Jupiter and Saturn trine favors...
   *
   * into natural reader-facing prose:
   *
   *   The Jupiter–Saturn trine favors...
   */

  const expanded =
    template
      .replaceAll(
        "{a}",
        planetA
      )
      .replaceAll(
        "{b}",
        planetB
      );

  return `The ${planetA}–${planetB} ${aspectName.toLowerCase()}${expanded.slice(
  `${planetA} and ${planetB} ${aspectName}`.length
)}`;
}

/*
 * -------------------------------------------------------
 * PLANET SEMANTIC SENTENCE
 * -------------------------------------------------------
 */

function semanticSentence(
  semantic,
  seed
) {
  if (!semantic) {
    return "";
  }

  const theme =
    semantic.theme;

  if (!theme) {
    return "";
  }

  const sectionThemes =
    SECTION_THEME_PROSE[
      semantic.section
    ];

  if (!sectionThemes) {
    return "";
  }

  const variations =
    sectionThemes[theme];

  if (!variations) {
    return "";
  }

  return chooseVariation(
    variations,
    seed
  );
}

/*
 * -------------------------------------------------------
 * BASE SECTION SENTENCES
 * -------------------------------------------------------
 */

const SECTION_BASE = {

  overview: {
    supportive: [
      "The day carries constructive momentum. Focus on what can realistically move forward.",
      "You may find useful momentum today when you keep your priorities clear.",
    ],

    challenging: [
      "Some resistance may appear around your plans. A measured response can help.",
      "Today's progress may require more patience than force.",
    ],

    balanced: [
      "The day is mixed but manageable. Stay attentive to what develops.",
      "Some areas may move smoothly while others require patience and adjustment.",
    ],
  },

  love: {
    supportive: [
      "Relationships benefit from warmth and genuine attention today.",
      "Connection can grow through honesty, patience and thoughtful attention.",
    ],

    challenging: [
      "Sensitive moments may require patience and a little more emotional space.",
      "Relationship matters may need more care than usual today.",
    ],

    balanced: [
      "Relationships may feel mixed but manageable today.",
      "Connection benefits from staying open without forcing certainty.",
    ],
  },

  career: {
    supportive: [
      "Your work benefits from steady effort and clear priorities today.",
      "Professional progress is easier when you focus on what matters most.",
    ],

    challenging: [
      "Your professional environment may contain obstacles that require patience.",
      "Work may demand more careful prioritization than usual.",
    ],

    balanced: [
      "Your professional day may contain both opportunities and obstacles.",
      "Career matters benefit from staying practical and organized.",
    ],
  },

  money: {
    supportive: [
      "Financial matters carry a constructive tone today.",
      "Practical choices can create useful financial momentum.",
    ],

    challenging: [
      "Financial decisions may require extra caution today.",
      "Avoid allowing short-term pressure to determine an important financial choice.",
    ],

    balanced: [
      "Financial matters benefit from practical judgment and measured choices.",
      "Money decisions are best handled without unnecessary urgency.",
    ],
  },

  energy: {
    supportive: [
      "Your energy can support steady forward movement today.",
      "You may have useful momentum when you give your energy a clear direction.",
    ],

    challenging: [
      "Your energy may come in waves, making pacing especially important.",
      "You may encounter frustration when action does not produce immediate results.",
    ],

    balanced: [
      "Your energy may vary through the day, so keep your pace flexible.",
      "A balanced pace can help you avoid both overexertion and unnecessary delay.",
    ],
  },

  communication: {
    supportive: [
      "Clear communication can make important conversations easier today.",
      "Thoughtful wording can help ideas move forward constructively.",
    ],

    challenging: [
      "Misunderstandings are easier to create when assumptions replace clear questions.",
      "Sensitive conversations may require more careful wording than usual.",
    ],

    balanced: [
      "Communication benefits from clarity, patience and active listening.",
      "Keep important conversations straightforward without rushing the response.",
    ],
  },

  emotional: {
    supportive: [
      "The emotional atmosphere supports greater awareness and understanding.",
      "You may find it easier to understand what you genuinely need today.",
    ],

    challenging: [
      "The emotional atmosphere may feel more sensitive than usual.",
      "Temporary moods may have more influence than they deserve if you react too quickly.",
    ],

    balanced: [
      "The emotional atmosphere is mixed but manageable.",
      "Give feelings room without allowing them to define the entire day.",
    ],
  },

  opportunity: {
    supportive: [
      "The day has constructive potential.",
      "Useful possibilities may become easier to recognize today.",
    ],

    challenging: [
      "Opportunities may require more preparation than immediate action.",
      "A promising possibility may need careful evaluation before you commit.",
    ],

    balanced: [
      "There is useful potential, but patience can help reveal which possibilities are worth pursuing.",
      "Stay open to opportunities without assuming every opening requires immediate action.",
    ],
  },

  guidance: {
    supportive: [
      "The best approach is to stay open while continuing to act deliberately.",
      "Steady confidence can help you make the most of the day.",
    ],

    challenging: [
      "The best approach is to slow down before reacting to pressure.",
      "Patience and careful judgment can prevent unnecessary complications.",
    ],

    balanced: [
      "The best approach is to stay measured and adaptable.",
      "Neither excessive caution nor excessive confidence is necessary today.",
    ],
  },
};

/*
 * -------------------------------------------------------
 * INFLUENCE
 * -------------------------------------------------------
 */

function sectionInfluence(
  semantic,
  interpretation
) {
  if (
    semantic?.planetInfluence === "supportive"
  ) {
    return "supportive";
  }

  if (
    semantic?.planetInfluence === "challenging"
  ) {
    return "challenging";
  }

  if (
    interpretation?.overallTone === "supportive"
  ) {
    return "supportive";
  }

  if (
    interpretation?.overallTone === "challenging"
  ) {
    return "challenging";
  }

  return "balanced";
}

/*
 * -------------------------------------------------------
 * V4.1 SEMANTIC DISTINCTNESS
 * -------------------------------------------------------
 *
 * Determines whether an aspect sentence contributes a
 * genuinely new idea or simply repeats the semantic text.
 *
 * This is intentionally deterministic and local.
 * It does not use AI, Math.random(), or external services.
 * -------------------------------------------------------
 */

const CONCEPT_GROUPS = [

  /*
   * Pacing / pressure
   */
  [
    "patience",
    "pacing",
    "slow down",
    "slowing down",
    "take your time",
    "forcing",
    "force",
    "rushing",
    "rush",
    "timing",
    "restraint",
    "pressure",
  ],

  /*
   * Opportunity / possibility
   */
  [
    "opportunity",
    "opportunities",
    "possibility",
    "possibilities",
    "opening",
    "openings",
    "potential",
    "progress",
    "momentum",
  ],

  /*
   * Relationship / harmony
   */
  [
    "relationship",
    "relationships",
    "connection",
    "connections",
    "cooperation",
    "harmony",
    "understanding",
    "closeness",
    "interaction",
  ],

  /*
   * Emotional sensitivity
   */
  [
    "emotion",
    "emotions",
    "emotional",
    "feelings",
    "sensitive",
    "sensitivity",
    "mood",
    "moods",
  ],

  /*
   * Communication
   */
  [
    "communication",
    "communicate",
    "conversation",
    "conversations",
    "message",
    "messages",
    "wording",
    "words",
    "listening",
    "clarity",
  ],

  /*
   * Growth / expansion
   */
  [
    "growth",
    "expand",
    "expansion",
    "develop",
    "development",
    "improvement",
    "advancement",
  ],

  /*
   * Structure / discipline
   */
  [
    "structure",
    "structured",
    "discipline",
    "disciplined",
    "planning",
    "organized",
    "organization",
    "consistency",
    "consistent",
  ],

  /*
   * Conflict / friction
   */
  [
    "friction",
    "conflict",
    "tension",
    "disagreement",
    "pressure",
    "competing",
    "struggle",
  ],

  /*
   * Financial resources
   */
  [
    "financial",
    "finance",
    "money",
    "resources",
    "spending",
    "risk",
    "security",
  ],

  /*
   * Energy / effort
   */
  [
    "energy",
    "effort",
    "vitality",
    "motivation",
    "momentum",
    "exhaustion",
    "fatigue",
  ],

  /*
   * Change / transformation
   */
  [
    "change",
    "changing",
    "transformation",
    "transform",
    "adjust",
    "adjusting",
    "adapt",
    "adaptability",
    "flexibility",
  ],
];

/*
 * Normalize prose for concept comparison.
 */
function normalizeProse(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
 * Return the concept groups represented in a sentence.
 */
function extractConceptGroups(value) {
  const text = normalizeProse(value);
  const groups = new Set();

  for (let i = 0; i < CONCEPT_GROUPS.length; i++) {
    const group = CONCEPT_GROUPS[i];

    if (
      group.some(
        phrase => text.includes(phrase)
      )
    ) {
      groups.add(i);
    }
  }

  return groups;
}

/*
 * Calculate semantic overlap between two sentences.
 *
 * 0 = unrelated
 * 1 = strongly overlapping
 */
function semanticOverlap(first, second) {
  if (!first || !second) {
    return 0;
  }

  const firstText =
    normalizeProse(first);

  const secondText =
    normalizeProse(second);

  if (
    firstText === secondText
  ) {
    return 1;
  }

  const firstConcepts =
    extractConceptGroups(firstText);

  const secondConcepts =
    extractConceptGroups(secondText);

  if (
    firstConcepts.size === 0 ||
    secondConcepts.size === 0
  ) {
    return 0;
  }

  let shared = 0;

  for (const concept of firstConcepts) {
    if (secondConcepts.has(concept)) {
      shared++;
    }
  }

  const smaller =
    Math.min(
      firstConcepts.size,
      secondConcepts.size
    );

  return smaller > 0
    ? shared / smaller
    : 0;
}

/*
 * Determine whether an aspect adds a distinct idea.
 *
 * An aspect is considered redundant when it strongly
 * overlaps the semantic sentence and does not introduce
 * another meaningful concept.
 */
function aspectAddsDistinctIdea(
  semanticText,
  aspectText,
  baseText = ""
) {
  if (!aspectText) {
    return false;
  }

  if (!semanticText) {
    return true;
  }

  const semanticOverlapScore =
    semanticOverlap(
      semanticText,
      aspectText
    );

  const baseOverlapScore =
    semanticOverlap(
      baseText,
      aspectText
    );

  /*
   * Strong semantic duplication.
   */
  if (
    semanticOverlapScore >= 0.75
  ) {
    return false;
  }

  /*
   * If both base and semantic express the
   * same conceptual area as the aspect, the
   * aspect is probably redundant.
   */
  if (
    semanticOverlapScore >= 0.5 &&
    baseOverlapScore >= 0.5
  ) {
    return false;
  }

  return true;
}

/*
 * -------------------------------------------------------
 * BUILD ONE SECTION
 * -------------------------------------------------------
 *
 * V4.1 section-aware deterministic composition.
 *
 * The section is built from:
 *
 *   1. base context
 *   2. planetary semantic
 *   3. aspect insight, only when it adds a
 *      sufficiently distinct idea
 *
 * This keeps the prose readable without requiring
 * every section to contain every available signal.
 * -------------------------------------------------------
 */

function buildSection(
  section,
  semantic,
  interpretation,
  seed
) {
  const influence =
    sectionInfluence(
      semantic,
      interpretation
    );

  const baseTemplates =
    SECTION_BASE[section]?.[influence] ??
    FALLBACK_THEMES[influence];

  const base =
    chooseVariation(
      baseTemplates,
      `${seed}:${section}:base`
    );

  const semanticText =
    semanticSentence(
      semantic,
      `${seed}:${section}:semantic`
    );

  const aspectText =
    aspectSentence(
      semantic?.aspect,
      section,
      `${seed}:${section}:aspect`
    );

  /*
   * V4.1:
   * Include the aspect only when it contributes
   * a meaningfully different idea.
   */
  const aspectIsUseful =
    aspectAddsDistinctIdea(
      semanticText,
      aspectText,
      base
    );

  const parts = [
    base,
    semanticText,
    aspectIsUseful
      ? aspectText
      : "",
  ].filter(Boolean);

  /*
   * Final exact-duplicate protection.
   */
  const uniqueParts = [];

  for (const part of parts) {
    if (!uniqueParts.includes(part)) {
      uniqueParts.push(part);
    }
  }

  return uniqueParts.join(" ");
}

/*
 * -------------------------------------------------------
 * PUBLIC API
 * -------------------------------------------------------
 */

export function generateHoroscopeProse(
  sunSign,
  interpretation,
  dateUTC = new Date(),
  loveSource = null
) {
  if (
    !sunSign ||
    typeof sunSign !== "string"
  ) {
    throw new Error(
      "generateHoroscopeProse requires a Sun sign."
    );
  }

  if (!interpretation) {
    throw new Error(
      "generateHoroscopeProse requires an interpretation."
    );
  }

  if (
    !(dateUTC instanceof Date) ||
    Number.isNaN(dateUTC.getTime())
  ) {
    throw new Error(
      "generateHoroscopeProse requires a valid Date."
    );
  }

  const semantics =
    buildAllSectionSemantics(
      interpretation
    );

  const dateKey =
    dateUTC.toISOString();

  const seed =
    `${sunSign}:${dateKey}`;

  const sections = {};

  for (const section of Object.keys(
    SECTION_BASE
  )) {
    if (section === "love") {
    sections[section] =
      generateLoveProse(
        sunSign,
        interpretation,
        dateUTC,
        seed,
        loveSource
      );

    continue;
  }
    sections[section] =
      buildSection(
        section,
        semantics[section],
        interpretation,
        seed
      );
  }


  return {
    sign: sunSign,

    date: dateKey,

    energy:
      interpretation.energy,

    focus:
      interpretation.focus,

    overallTone:
      interpretation.overallTone,

    score:
      interpretation.combinedScore,

    sections,
  };
}
