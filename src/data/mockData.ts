import { Lesson, Quiz, SyncQueueItem, UserProfile } from '../types';

export const initialProfile: UserProfile = {
  id: 'usr-101',
  name: 'Aarav Deshmukh',
  grade: 4, // Default primary grade (Grade 4)
  role: 'student',
  schoolHub: 'Zilla Parishad High School, Wardha',
  avatar: '🦁',
  language: 'en',
  xp: 420,
  streakDays: 5,
  stars: 18,
};

export const sampleSchools = [
  'Zilla Parishad High School, Wardha (State Board)',
  'Govt Model Higher Secondary School, Satara',
  'Shri Shivaji Vidyalaya, Kolhapur',
  'Adarsh Madhyamik Vidyalaya, Pune Rural',
  'Vidyaniwas School, Amravati Center',
];

export const PRIMARY_AVATARS = ['🦁', '🦊', '🐼', '🐬', '🚀', '⭐', '🦉', '🎨'];
export const SECONDARY_AVATARS = ['⚡', '🔬', '📐', '💡', '🌐', '📚', '🧭', '🎯'];

export const mockLessons: Lesson[] = [
  // =================================================================
  // PRIMARY LESSONS (Grades 1-5) - STATE BOARD CURRICULUM
  // =================================================================
  {
    id: 'pri-sb-1',
    title: 'States of Matter: Solids, Liquids & Gases',
    subject: 'General Science',
    gradeBand: 'primary',
    minGrade: 3,
    maxGrade: 5,
    description: 'Learn how molecules behave inside ice cubes, flowing drinking water, and rising steam balloons!',
    readTimeMin: 4,
    isDownloaded: true,
    sizeKb: 540,
    xpReward: 50,
    thumbnailIcon: '🧊',
    slides: [
      {
        title: '1. What is Matter?',
        text: 'Everything around you that has weight and occupies space is called matter. Your textbook, pencil box, water bottle, and the air you breathe are all forms of matter made of tiny particles called molecules.',
        keyPoint: 'Matter exists in three basic physical states: Solid, Liquid, and Gas.',
        illustrationConcept: 'three_states_matter',
      },
      {
        title: '2. Solids: Tightly Packed Friends',
        text: 'In a solid (like your wooden desk or a stone), molecules are packed tightly together like children holding hands in a circle. Because they cannot move around freely, solids keep their fixed shape and size.',
        keyPoint: 'Solids have a definite shape and a definite volume.',
        illustrationConcept: 'solid_molecules_packed',
      },
      {
        title: '3. Liquids & Gases: Free to Flow',
        text: 'In water or milk, molecules have little spaces between them and slide past each other, taking the shape of whatever cup or bucket you pour them into. In air and steam, molecules zoom all over the room freely!',
        keyPoint: 'Liquids have fixed volume but no fixed shape. Gases have neither fixed shape nor fixed volume.',
        illustrationConcept: 'gas_liquid_molecules',
      },
    ],
    practicalActivity: {
      title: 'Kitchen Ice Melt Experiment',
      villageContext: 'Take an ice cube from the kitchen clay pot or ice tray and place it in a steel saucer under the ceiling fan.',
      instructions: [
        'Watch the ice (solid) melt into liquid water as heat warms the particles.',
        'Dip your finger to feel the cooling effect as matter changes state!',
      ],
    },
  },
  {
    id: 'pri-sb-2',
    title: 'Fractions Made Simple: Halves & Quarters',
    subject: 'Mathematics',
    gradeBand: 'primary',
    minGrade: 2,
    maxGrade: 5,
    description: 'Master 1/2, 1/4, and 3/4 through fun shape cutting, paper folding, and sharing chapatis equally!',
    readTimeMin: 4,
    isDownloaded: true,
    sizeKb: 480,
    xpReward: 45,
    thumbnailIcon: '🍕',
    slides: [
      {
        title: '1. What is a Fraction?',
        text: 'When an entire object is divided into equal parts, each part represents a fraction of the whole. If Mother cuts one round chapati into 2 equal pieces, each piece is 1/2 (one-half).',
        keyPoint: 'Fraction = (Parts you have) / (Total equal parts). The top number is Numerator, bottom is Denominator.',
        illustrationConcept: 'half_chapati_fraction',
      },
      {
        title: '2. Making Quarters (1/4)',
        text: 'Now fold that chapati again! You get 4 equal quarters. One slice is 1/4 (one-fourth or "Paav"). Two slices equal 2/4 which simplifies back to 1/2 ("Adha"). Three slices equal 3/4 ("Paun").',
        keyPoint: '2/4 is the exact same amount as 1/2!',
        illustrationConcept: 'quarter_fractions_grid',
      },
      {
        title: '3. Adding Like Fractions',
        text: 'When denominators are the same, just add the numerators! For example: 1/4 of a chocolate bar + 2/4 of the chocolate bar = 3/4 of the chocolate bar!',
        keyPoint: 'Rule: 1/4 + 2/4 = (1 + 2)/4 = 3/4.',
        illustrationConcept: 'fraction_addition_bar',
      },
    ],
    practicalActivity: {
      title: 'Paper Origami Fraction Strips',
      villageContext: 'Take a long rectangular strip of your notebook paper.',
      instructions: [
        'Fold it in half and crease: mark each side 1/2.',
        'Fold in half again: unfold to find 4 equal sections of 1/4 each!',
      ],
    },
  },
  {
    id: 'pri-sb-3',
    title: 'Simple Machines: Levers, Pulleys & Inclined Planes',
    subject: 'General Science',
    gradeBand: 'primary',
    minGrade: 3,
    maxGrade: 5,
    description: 'Discover how seesaws, scissors, flagpole ropes, and wheelbarrows make human work effortless!',
    readTimeMin: 5,
    isDownloaded: false,
    sizeKb: 620,
    xpReward: 55,
    thumbnailIcon: '⚙️',
    slides: [
      {
        title: '1. Why Do We Use Machines?',
        text: 'A simple machine is a tool with few or no moving parts that makes work easier by changing the direction or magnitude of force. The 6 classic simple machines are: Lever, Pulley, Wheel & Axle, Inclined Plane, Wedge, and Screw.',
        keyPoint: 'Simple machines give us Mechanical Advantage so small effort lifts heavy loads.',
        illustrationConcept: 'simple_machines_overview',
      },
      {
        title: '2. The Lever: Load, Effort & Fulcrum',
        text: 'A seesaw in your playground is a Class 1 lever! The pivot point in the middle is the Fulcrum. Where your friend sits is the Load, and where you push down with your feet is the Effort. A crowbar or pair of scissors works on this exact principle!',
        keyPoint: 'Fulcrum in the center = Class 1 Lever (Seesaw, Pliers, Crowbar).',
        illustrationConcept: 'lever_fulcrum_diagram',
      },
      {
        title: '3. Pulleys and Slopes',
        text: 'Raising the national flag on Independence Day uses a Pulley at the top of the flagpole! Pushing a bicycle up a smooth ramp (Inclined Plane) takes far less effort than lifting it straight up.',
        keyPoint: 'Ramps and pulleys trade distance for reduced effort.',
        illustrationConcept: 'pulley_and_ramp',
      },
    ],
  },
  {
    id: 'pri-sb-4',
    title: 'Grammar Power: Action Verbs & Tenses',
    subject: 'English & Grammar',
    gradeBand: 'primary',
    minGrade: 2,
    maxGrade: 5,
    description: 'Build sharp sentence skills with Past, Present, and Future tenses for State Board exams.',
    readTimeMin: 4,
    isDownloaded: true,
    sizeKb: 410,
    xpReward: 40,
    thumbnailIcon: '📝',
    slides: [
      {
        title: '1. What is an Action Verb?',
        text: 'A verb is a doing word that expresses an action, event, or state of being. Examples: run, write, read, jump, think, play.',
        keyPoint: 'Every complete English sentence must contain a verb!',
        illustrationConcept: 'action_verbs_illustration',
      },
      {
        title: '2. Three Simple Tenses',
        text: 'Present: "I read my textbook." (happening now). Past: "I read my textbook yesterday." (already finished). Future: "I will read my textbook tomorrow." (going to happen).',
        keyPoint: 'Use "will" or "shall" to form simple future tense.',
        illustrationConcept: 'timeline_tenses',
      },
    ],
  },

  // =================================================================
  // SECONDARY LESSONS (Grades 6-10) - STATE BOARD CURRICULUM
  // =================================================================
  {
    id: 'sec-sb-1',
    title: "Electricity & Ohm's Law: V = I × R",
    subject: 'Physics (Class 9 & 10)',
    gradeBand: 'secondary',
    minGrade: 8,
    maxGrade: 10,
    description: 'Current, potential difference, resistance in series and parallel, and mathematical derivation of Ohm’s Law with graph plotting.',
    readTimeMin: 7,
    isDownloaded: true,
    sizeKb: 890,
    xpReward: 85,
    thumbnailIcon: '⚡',
    slides: [
      {
        title: "1. Statement of Ohm's Law",
        text: 'Ohm’s law states that at constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends: V ∝ I, or V = I × R, where R is the resistance of the conductor.',
        keyPoint: 'Formula: V = I × R (Volts = Amperes × Ohms). Slope of V-I graph represents Resistance.',
        illustrationConcept: 'ohms_law_circuit_diagram',
      },
      {
        title: '2. Factors Affecting Resistance',
        text: 'The electrical resistance of a conductor depends directly on its length (R ∝ l), inversely on its cross-sectional area (R ∝ 1/A), and on the nature of the material (resistivity ρ): R = ρ × (l / A). Thick copper wires have low resistance, while Nichrome alloy has high resistance for heating elements.',
        keyPoint: 'Resistivity (ρ) unit is Ohm-meter (Ω·m). Metals are conductors; rubber and glass are insulators.',
        illustrationConcept: 'conductor_resistance_geometry',
      },
      {
        title: '3. Resistors in Series vs Parallel',
        text: 'Series combination: R_total = R1 + R2 + R3 (current remains constant, voltages divide). Parallel combination: 1/R_total = 1/R1 + 1/R2 + 1/R3 (voltage across each resistor remains constant, current divides). Domestic household circuits are always connected in parallel!',
        keyPoint: 'Parallel connection ensures appliances operate at full 230V mains voltage independently.',
        illustrationConcept: 'series_parallel_schematic',
      },
    ],
    practicalActivity: {
      title: 'State Board Lab Practical: V-I Characteristic Verification',
      villageContext: 'Using the school science laboratory kit containing battery eliminator, rheostat, ammeter, voltmeter, and Nichrome wire coil.',
      instructions: [
        'Connect voltmeter in parallel across resistor and ammeter in series with the circuit.',
        'Vary rheostat slider to record 5 readings of (V, I) in the observation table.',
        'Plot V along Y-axis and I along X-axis to verify the straight-line graph passing through origin!',
      ],
    },
  },
  {
    id: 'sec-sb-2',
    title: 'Linear Equations in Two Variables: ax + by + c = 0',
    subject: 'Mathematics (Class 9 & 10)',
    gradeBand: 'secondary',
    minGrade: 8,
    maxGrade: 10,
    description: 'Simultaneous equation solution methods: Elimination, Substitution, and Graphical Coordinate Method for State Board Board Exams.',
    readTimeMin: 8,
    isDownloaded: true,
    sizeKb: 780,
    xpReward: 80,
    thumbnailIcon: '📐',
    slides: [
      {
        title: '1. General Form & Graphical Meaning',
        text: 'An equation of the form ax + by + c = 0, where a, b, c are real numbers and a, b ≠ 0, is a linear equation in two variables. Its graphical representation is always a straight line on the Cartesian XY plane.',
        keyPoint: 'Every point (x, y) satisfying the equation lies on the line.',
        illustrationConcept: 'linear_equation_graph',
      },
      {
        title: '2. Solving Simultaneous Equations by Elimination',
        text: 'Given: (1) 2x + y = 10 and (2) 3x - y = 5. Adding both equations directly eliminates y: (2x + 3x) = (10 + 5) => 5x = 15 => x = 3. Substituting x = 3 into (1): 2(3) + y = 10 => 6 + y = 10 => y = 4. Solution set: (3, 4).',
        keyPoint: 'Elimination method cancels one variable by matching coefficients.',
        illustrationConcept: 'elimination_algebra_steps',
      },
      {
        title: "3. Cramer's Rule (Determinant Method)",
        text: "Determinant D = |a1 b1; a2 b2| = a1·b2 - a2·b1. Dx and Dy are formed by replacing the x-column and y-column with constants. Values: x = Dx / D and y = Dy / D, provided D ≠ 0.",
        keyPoint: 'Cramer’s rule provides rapid matrix solutions for Board exam 4-mark questions.',
        illustrationConcept: 'cramers_rule_matrix',
      },
    ],
  },
  {
    id: 'sec-sb-3',
    title: 'Cell Structure, Mitosis & Life Processes',
    subject: 'Biology (Class 9 & 10)',
    gradeBand: 'secondary',
    minGrade: 7,
    maxGrade: 10,
    description: 'Plant vs animal cell organelles, ATP synthesis in mitochondria, DNA replication, and stages of mitotic cell division (Prophase to Telophase).',
    readTimeMin: 8,
    isDownloaded: false,
    sizeKb: 950,
    xpReward: 90,
    thumbnailIcon: '🔬',
    slides: [
      {
        title: '1. Cell: The Fundamental Unit of Life',
        text: 'Discovered by Robert Hooke in 1665, the cell is the structural and functional unit of living organisms. Key organelles: Nucleus (stores genetic chromatin), Mitochondria (powerhouse producing ATP), Chloroplasts (photosynthesis in plant cells), and Ribosomes (protein synthesis).',
        keyPoint: 'Plant cells possess a rigid Cellulose Cell Wall and large central vacuole; animal cells do not.',
        illustrationConcept: 'plant_vs_animal_cell',
      },
      {
        title: '2. Mitosis: Four Stages of Equational Division',
        text: 'Mitosis is somatic cell division required for body growth and tissue repair. The 4 stages: (1) Prophase (chromosomes condense, nuclear envelope breaks down), (2) Metaphase (chromosomes line up at equatorial plane), (3) Anaphase (sister chromatids pulled apart by spindle fibers), (4) Telophase (two identical daughter nuclei form followed by cytokinesis).',
        keyPoint: 'Chromosome number remains conserved (2n to 2n). In humans, 46 chromosomes in parent produce 46 in each daughter cell.',
        illustrationConcept: 'mitosis_four_stages',
      },
    ],
  },
  {
    id: 'sec-sb-4',
    title: 'Chemical Reactions & Balancing Equations',
    subject: 'Chemistry (Class 10)',
    gradeBand: 'secondary',
    minGrade: 9,
    maxGrade: 10,
    description: 'Combination, Decomposition, Displacement, and Double Displacement reactions with Law of Conservation of Mass.',
    readTimeMin: 7,
    isDownloaded: true,
    sizeKb: 820,
    xpReward: 85,
    thumbnailIcon: '🧪',
    slides: [
      {
        title: '1. Law of Conservation of Mass',
        text: 'In any chemical reaction, total mass of reactants equals total mass of products. Atoms can neither be created nor destroyed. Hence, every chemical equation must have equal numbers of each element on both sides.',
        keyPoint: 'Example: Unbalanced: H2 + O2 -> H2O. Balanced: 2H2 + O2 -> 2H2O.',
        illustrationConcept: 'balanced_reaction_scale',
      },
      {
        title: '2. Four Types of Chemical Reactions',
        text: '(1) Combination: A + B -> AB (e.g., Quicklime CaO + H2O -> Slaked lime Ca(OH)2). (2) Decomposition: AB -> A + B (e.g., Thermal decomposition of CaCO3 -> CaO + CO2). (3) Displacement: More reactive metal replaces less reactive metal (Fe + CuSO4 -> FeSO4 + Cu). (4) Double Displacement: Ion exchange (BaCl2 + Na2SO4 -> BaSO4 precipitate + 2NaCl).',
        keyPoint: 'Displacement follows the Metal Reactivity Series: K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag > Au.',
        illustrationConcept: 'types_chemical_reactions',
      },
    ],
  },
];

export const mockQuizzes: Quiz[] = [
  // Primary State Board Quiz
  {
    id: 'pri-quiz-1',
    title: 'Class 4 & 5 State Board Science & Math Challenge',
    subject: 'Science & Mathematics',
    gradeBand: 'primary',
    xpReward: 60,
    durationMin: 5,
    questions: [
      {
        id: 'pq-1',
        question: 'Which of the following is an example of matter in the Liquid state at room temperature?',
        options: ['Wooden desk', 'Clean drinking water', 'Air inside football', 'Steel spoon'],
        correctIndex: 1,
        explanation: 'Water takes the shape of its container and flows freely, which is the defining property of liquids!',
        hint: 'It flows and quenches your thirst!',
      },
      {
        id: 'pq-2',
        question: 'If you have a cake cut into 4 equal slices and you eat 2 slices, what fraction of the cake did you eat?',
        options: ['1/4', '2/4 (which is equal to 1/2)', '3/4', '4/1'],
        correctIndex: 1,
        explanation: '2 out of 4 slices = 2/4. When simplified by dividing top and bottom by 2, it equals exactly 1/2 (half)!',
        hint: '2 out of 4 is half the whole cake!',
      },
      {
        id: 'pq-3',
        question: 'A seesaw in the school playground has the pivot in the center. Which simple machine is it?',
        options: ['Class 1 Lever', 'Inclined Plane', 'Screw jack', 'Wedge'],
        correctIndex: 0,
        explanation: 'A seesaw has its Fulcrum right in the middle between Load and Effort, making it a classic Class 1 Lever!',
        hint: 'Think about levers where the center is the balancing point.',
      },
    ],
  },
  // Secondary State Board Quiz
  {
    id: 'sec-quiz-1',
    title: 'Class 10 State Board Board Exam Benchmark: Physics & Math',
    subject: 'Physics & Mathematics',
    gradeBand: 'secondary',
    xpReward: 100,
    durationMin: 8,
    questions: [
      {
        id: 'sq-1',
        question: "According to Ohm's Law (V = I × R), if a potential difference of 12 Volts is applied across a 4 Ohm resistor, what is the electric current flowing through it?",
        options: [
          '48 Amperes',
          '3 Amperes',
          '0.33 Amperes',
          '16 Amperes',
        ],
        correctIndex: 1,
        explanation: 'Using I = V / R: I = 12 V / 4 Ω = 3 Amperes.',
        hint: 'Rearrange V = I × R to find current I = V / R.',
      },
      {
        id: 'sq-2',
        question: 'In the linear equation system 2x + y = 10 and 3x - y = 5, what is the value of x when solved simultaneously?',
        options: [
          'x = 2',
          'x = 3',
          'x = 5',
          'x = 1',
        ],
        correctIndex: 1,
        explanation: 'Adding both equations: (2x + 3x) + (y - y) = 10 + 5 => 5x = 15 => x = 3. Substituting into first equation gives y = 4.',
        hint: 'Add the two equations to eliminate y directly.',
      },
      {
        id: 'sq-3',
        question: 'Which organelle is recognized as the "Powerhouse of the Cell" because it synthesizes cellular energy in the form of ATP?',
        options: [
          'Ribosome',
          'Mitochondria',
          'Endoplasmic Reticulum',
          'Lysosome',
        ],
        correctIndex: 1,
        explanation: 'Mitochondria perform aerobic cellular respiration, generating Adenosine Triphosphate (ATP) molecules used for cellular work.',
        hint: 'It has folded inner membranes called cristae.',
      },
    ],
  },
];

export const initialSyncQueue: SyncQueueItem[] = [
  {
    id: 'sync-1',
    type: 'quiz_submission',
    title: 'Class 4 Science Unit Test: States of Matter (Score: 100%)',
    timestamp: 'Today at 03:15 PM',
    sizeKb: 14,
    status: 'pending',
  },
  {
    id: 'sync-2',
    type: 'lesson_progress',
    title: 'Ohm’s Law V-I Lab Practical Notes & Observation Table',
    timestamp: 'Today at 03:40 PM',
    sizeKb: 10,
    status: 'pending',
  },
  {
    id: 'sync-3',
    type: 'assignment_draft',
    title: 'Linear Equations Graph Worksheet Submission',
    timestamp: 'Today at 04:10 PM',
    sizeKb: 24,
    status: 'pending',
  },
];

// UML Architecture data from PDF context
export const umlArchitectureData = {
  deployment: {
    title: 'UML Deployment Diagram',
    subtitle: 'Physical & Runtime Architecture for Rural School Sync',
    nodes: [
      {
        name: 'Student Device',
        type: 'Device Node «device»',
        description: 'Low-cost tablet, mobile, or desktop running the adaptive web application locally.',
        artifacts: ['Student Offline Cache (LocalStorage / IndexedDB)', 'Local Sync Queue'],
      },
      {
        name: 'Teacher Device',
        type: 'Device Node «device»',
        description: 'Classroom tablet or laptop to publish lessons, review sync items, and evaluate quizzes.',
        artifacts: ['Teacher Offline Cache', 'Evaluation & Feedback Queue'],
      },
      {
        name: 'Rural School Hub',
        type: 'Execution Node «hub»',
        description: 'Local on-premise micro-server / Raspberry Pi / local Wi-Fi router deployed at rural schools with intermittent backhaul.',
        artifacts: ['Local Cache & Sync Aggregator', 'Peer-to-Peer Content Distributor'],
      },
      {
        name: 'Cloud Backend / Central Services',
        type: 'Server Node «cloud»',
        description: 'Scalable cloud infrastructure that syncs data whenever backhaul connectivity is available.',
        artifacts: ['Central API Gateway', 'Learning & Assessment Services', 'PostgreSQL / Data Service', 'Content Repository'],
      },
    ],
  },
  package: {
    title: 'UML Package Diagram',
    subtitle: 'Logical Grouping of System Responsibilities (8 Core Packages)',
    packages: [
      { name: '1. User Management', role: 'Accounts, student grade profiles, multi-role access (Student, Teacher, Parent, Admin).' },
      { name: '2. Learning Management', role: 'State Board curriculum distribution, textbook units, multimedia notes.' },
      { name: '3. Assessment', role: 'Assignments, quizzes, automatic grading, student performance metrics, streak badges.' },
      { name: '4. Communication', role: 'School notice board, audio announcements, teacher-student Q&A, parent SMS briefs.' },
      { name: '5. Offline & Sync', role: 'Local IndexedDB cache, queue manager, conflict reconciliation, hub backhaul bridge.' },
      { name: '6. Administration', role: 'School-level student enrollment, class allocation, device hardware registry.' },
      { name: '7. Data Management', role: 'Persistent storage, ACID transactional consistency, data access services.' },
      { name: '8. Security & Access', role: 'Role-based authorization, privacy protection for rural learners, API token verification.' },
    ],
  },
  component: {
    title: 'UML Component Diagram',
    subtitle: 'Major Software Modules & Interfaces',
    components: [
      { name: 'Student App', interface: 'userAPI / syncAPI', role: 'Adaptive interface rendering primary vs secondary themes.' },
      { name: 'Teacher Portal', interface: 'teacherAPI', role: 'Lesson drafting, assignment grading, and attendance monitoring.' },
      { name: 'API Gateway', interface: 'HTTP / REST', role: 'Central entry point routing requests to internal microservices.' },
      { name: 'Authentication Service', role: 'Validates tokens and enforces grade-based role permissions.' },
      { name: 'Learning Service', role: 'Serves syllabi, lesson units, and interactive learning media.' },
      { name: 'Assessment Service', role: 'Evaluates quiz submissions, calculates marks, records streaks and XP.' },
      { name: 'Offline & Sync Service', role: 'Buffers queued operations and reconciles offline student states.' },
      { name: 'Data Service & Content Repo', role: 'Central persistence layer and educational media storage.' },
    ],
  },
  compositeStructure: {
    title: 'UML Composite Structure Diagram',
    subtitle: 'Internal Structure & Ports of «RuralConnectPlatform»',
    boundary: 'RuralConnectPlatform',
    ports: ['userAPI', 'learningAPI', 'assessmentAPI', 'syncAPI'],
    parts: [
      { name: 'userManagement', multiplicity: '1' },
      { name: 'learningManagement', multiplicity: '1' },
      { name: 'assessment', multiplicity: '1' },
      { name: 'communication', multiplicity: '1' },
      { name: 'offlineSync', multiplicity: '1' },
      { name: 'dataManagement', multiplicity: '1' },
      { name: 'securityAccess', multiplicity: '1' },
    ],
  },
};
