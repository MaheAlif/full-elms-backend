-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 11:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elms`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_interactions`
--

CREATE TABLE `ai_interactions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `query` text DEFAULT NULL,
  `response` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_interactions`
--

INSERT INTO `ai_interactions` (`id`, `user_id`, `query`, `response`, `created_at`) VALUES
(1, 9, 'How do I properly use useEffect with cleanup functions?', 'UseEffect cleanup functions are crucial for preventing memory leaks. Here\'s how to implement them properly: [detailed explanation with code examples]', '2025-09-30 19:01:16'),
(2, 9, 'What\'s the difference between supervised and unsupervised learning?', 'Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data. [comprehensive explanation with examples]', '2025-09-30 19:01:16'),
(3, 10, 'How can I optimize React component re-renders?', 'To optimize React re-renders, use React.memo, useMemo, useCallback, and proper state structure. [detailed optimization strategies]', '2025-09-30 19:01:16'),
(4, 10, 'Explain the concept of overfitting in machine learning', 'Overfitting occurs when a model performs well on training data but poorly on new data. [explanation with prevention techniques]', '2025-09-30 19:01:16'),
(5, 11, 'Can you explain database normalization with examples?', 'Database normalization eliminates redundancy and ensures data integrity. [step-by-step normalization process with examples]', '2025-09-30 19:01:16'),
(6, 11, 'What are the different types of SQL joins?', 'SQL joins combine data from multiple tables: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN. [detailed explanation with examples]', '2025-09-30 19:01:16'),
(7, 32, 'ok, what is your name?', '\nHello! I\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, answer questions about course materials, and provide guidance with assignments. How can I assist you today?', '2025-10-16 23:25:21'),
(8, 32, 'Hello', 'Hello again! I\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, and assist with any assignments or questions you might have. How can I support you today?', '2025-10-16 23:26:37'),
(9, 32, 'Hello', '\nHello! 👋 \n\nI\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, answer questions about course materials, and provide guidance with assignments. \n\nHow can I assist you today?', '2025-10-16 23:29:20'),
(10, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', 'I\'d be happy to help you understand how to approach studying the \"New Book\" PDF from your Economics course. However, I don\'t have access to the specific content of the PDF you\'ve added to your context.\n\nWithout seeing the actual material, I can provide some general guidance on what economics materials typically cover and how to approach studying them:\n\n**Common Economics Topics:**\n1. Microeconomics vs. Macroeconomics\n2. Supply and demand principles\n3. Market structures (perfect competition, monopoly, oligopoly, monopolistic competition)\n4. Elasticity concepts\n5. Production costs and theory of the firm\n6. National income accounting\n7. Fiscal and monetary policy\n8. Inflation and unemployment\n9. Economic growth theories\n10. International trade and finance\n\n**Study Approach for Economics:**\n1. **Preview the material** first - look at the table of contents, chapter headings, and summaries\n2. **Identify key concepts** and terminology that appear repeatedly\n3. **Look for graphs and models** - economics heavily uses visual representations\n4. **Work through examples** step-by-step to understand applications\n5. **Create summary notes** of main concepts and how they connect\n6. **Practice problems** if available - economics often requires application of concepts\n7. **Form study groups** to discuss and explain concepts to each other\n8. **Relate concepts to current economic events** to make them more concrete\n\nIf you could share some specific information about the book (such as the title, author, or table of contents), I could provide more targeted advice on what topics it likely covers and how to approach studying it effectively.', '2025-10-16 23:33:19'),
(11, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', '\nI don\'t have access to the specific content of the \"New Book\" PDF you\'ve mentioned. To provide accurate information about the topics it covers and tailored study advice, I would need more details about the book.\n\nCould you share some information about the book, such as:\n- The full title and author(s)\n- Any subtitle that might indicate the focus area\n- The course name or level (introductory, intermediate, advanced economics)\n- Any specific topics you\'ve noticed while browsing it\n\nIn the meantime, I can offer some general guidance on economics textbooks:\n- Most economics books cover core areas like microeconomics, macroeconomics, international economics, or specialized fields\n- Look for the table of contents and chapter summaries to identify main topics\n- Approach economics study by connecting theories to real-world examples\n- Pay attention to graphs and models as they\'re central to economic analysis\n- Practice problems are essential for mastering economic concepts\n\nOnce you provide more details about the specific book, I can give you more targeted advice on its content and how to study it effectively for your course.', '2025-10-16 23:33:19'),
(12, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', 'I notice you\'ve mentioned a \"New Book\" (pdf) from your Economics course, but I don\'t have access to the specific content of this material. Without seeing the actual book or at least knowing its title, author, or table of contents, I can only provide general guidance about economics materials.\n\nCommon topics covered in economics textbooks typically include:\n- Microeconomics (supply and demand, market structures, consumer theory)\n- Macroeconomics (GDP, inflation, unemployment, economic growth)\n- Economic theories and models\n- Economic policy analysis\n- International economics\n- Behavioral economics\n- Econometrics and economic methods\n\nFor effective study of any economics material, I recommend:\n1. Skimming the table of contents and introduction first to understand the structure\n2. Creating a study plan based on your course schedule\n3. Taking notes while reading, focusing on key concepts and formulas\n4. Working through examples and practice problems\n5. Connecting concepts to real-world applications\n6. Reviewing regularly with summaries or flashcards\n\nIf you can share more details about the specific book (title, author, table of contents, or any particular chapters you\'re focusing on), I can provide more targeted assistance with understanding the content and effective study strategies for this specific material.', '2025-10-16 23:33:31'),
(13, 32, 'tell me about econoics', '\n\nEconomics is the social science that studies how individuals, businesses, governments, and societies make choices about allocating scarce resources to satisfy unlimited wants and needs.\n\n**Main Branches of Economics:**\n\n1. **Microeconomics**: Studies the behavior of individual economic agents (households, firms) and how they interact in specific markets.\n   - Topics: Supply and demand, consumer choice, production costs, market structures\n\n2. **Macroeconomics**: Examines the economy as a whole.\n   - Topics: GDP, inflation, unemployment, economic growth, fiscal and monetary policy\n\n**Key Concepts:**\n- **Scarcity**: The fundamental economic problem that resources are limited while wants are unlimited\n- **Opportunity Cost**: The value of the next best alternative foregone when making a decision\n- **Incentives**: Factors that motivate economic behavior\n- **Markets**: Systems where buyers and sellers interact\n- **Efficiency**: Using resources to maximize output or satisfaction\n\nEconomics helps us understand important questions like:\n- How are prices determined?\n- Why do some countries grow while others don\'t?\n- What causes unemployment?\n- How should governments tax and spend?\n\nWould you like me to explain any specific concept in more detail, or help you understand how to approach studying economics based on your course material?', '2025-10-16 23:33:42'),
(14, 32, 'hello', '\nHello! 👋 \n\nI\'m here to help you with your economics studies. I noticed you\'ve been working with a new economics textbook. How can I assist you today? Do you have questions about specific economic concepts, need help with homework, or would like study tips for your economics course?', '2025-10-16 23:44:03'),
(15, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', '\nI\'d be happy to help you understand your economics study material, but I don\'t actually have access to the \"New Book\" PDF you\'ve mentioned. Without seeing the specific content, I can only provide general guidance about what economics materials typically cover and how to approach studying them.\n\nCommon topics in economics textbooks include:\n- Microeconomics (supply and demand, market structures, consumer theory)\n- Macroeconomics (GDP, inflation, unemployment, fiscal and monetary policy)\n- Economic theories and models\n- International economics\n- Econometrics\n- Current economic issues and applications\n\nFor studying economics effectively:\n1. Start by reviewing the table of contents and introduction to understand the book\'s structure\n2. Focus on understanding key economic concepts rather than just memorizing\n3. Work through examples and practice problems\n4. Create summary notes of important theories and models\n5. Relate concepts to real-world economic events\n\nIf you can share some specific content or details from the book, I\'d be able to provide more targeted assistance with understanding particular topics or sections.', '2025-10-16 23:44:15'),
(16, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', 'I\'d be happy to help you understand how to approach studying the \"New Book\" PDF from your Economics course. However, I don\'t have direct access to the specific content of the PDF you\'ve added to your context.\n\nTo provide you with the most helpful guidance on topics and study approaches, could you share some information about the book? For example:\n- Do you know the title or author of the book?\n- Can you describe the table of contents or any chapter headings you\'ve seen?\n- Is this book focused on a specific area of economics (microeconomics, macroeconomics, econometrics, etc.)?\n\nOnce I have this information, I can help you:\n1. Identify the key economic topics likely covered in the material\n2. Suggest an effective study strategy tailored to the content\n3. Recommend ways to take notes and organize the information\n4. Provide guidance on connecting the concepts to your course objectives\n\nIf you can\'t share specific details about the book, I can still offer general advice on studying economics materials effectively.', '2025-10-16 23:44:18'),
(17, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', '\nI\'d be happy to help you understand what topics might be in your economics book and how to approach studying it. However, without seeing the specific content of the \"New Book\" PDF, I can only provide general guidance based on typical economics course materials.\n\n**Common Topics in Economics Textbooks:**\n\nMicroeconomics:\n- Supply and demand\n- Elasticity\n- Consumer choice theory\n- Production and costs\n- Market structures (perfect competition, monopoly, oligopoly, monopolistic competition)\n- Market failures and externalities\n- Income distribution\n\nMacroeconomics:\n- National income accounting\n- Economic growth\n- Unemployment and inflation\n- Fiscal and monetary policy\n- International trade and finance\n- Business cycles\n\n**Study Strategies for Economics:**\n\n1. **Active Reading**: Don\'t just passively read. Take notes, highlight key concepts, and ask questions as you go.\n\n2. **Master the Fundamentals**: Economics builds on foundational concepts. Ensure you understand basic principles like opportunity cost, marginal analysis, and comparative advantage before moving to more complex topics.\n\n3. **Visual Learning**: Pay attention to graphs and diagrams. Try to redraw them yourself to reinforce understanding.\n\n4. **Practice Problems**: Work through examples and practice questions to apply theoretical concepts.\n\n5. **Real-World Connections**: Relate economic theories to current events and real-world situations to make the material more relevant and memorable.\n\n6. **Form Study Groups**: Discussing economic concepts with peers can provide new perspectives and deepen understanding.\n\n7. **Review Regularly**: Economics concepts build upon each other, so regular review is essential.\n\nIf you can provide more specific information about the book or particular chapters you\'re focusing on,', '2025-10-16 23:44:21'),
(18, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', 'I\'d be happy to help you with your economics book, but I don\'t have direct access to the \"New Book\" PDF you\'ve added to your context. Without seeing the actual content, I can\'t tell you exactly what topics it covers.\n\nTo give you more specific guidance, could you share some details about the book? For example:\n- Do you see the title, author, or edition information?\n- Is there a table of contents or introduction you could describe?\n- What specific chapter or section are you currently working on?\n\nIn the meantime, I can offer some general guidance:\n\n**Typical Economics Book Topics:**\n- Microeconomics (supply and demand, market structures, consumer theory)\n- Macroeconomics (GDP, inflation, unemployment, economic growth)\n- International economics (trade, exchange rates)\n- Economic theories and models\n- Current economic issues and policies\n\n**General Study Strategies for Economics:**\n1. Start with an overview of each chapter\'s learning objectives\n2. Focus on understanding key concepts and definitions\n3. Practice solving problems and applying theories to scenarios\n4. Create visual aids like graphs and charts for economic relationships\n', '2025-10-16 23:44:24'),
(19, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', '\nI\'d be happy to help you understand the economics material and suggest study approaches, but I don\'t currently have access to the content of the \"New Book\" PDF you mentioned. \n\nTo provide you with specific guidance about the topics covered and tailored study strategies, I would need to see the actual content of the document. Could you please share some key information about the book, such as:\n\n- The title and author(s)\n- The table of contents\n- The introduction or preface\n- Any chapter headings or summaries\n\nIn the meantime, here\'s some general advice for studying economics materials:\n\n1. **Start with the big picture**: Understand the fundamental concepts before diving into details\n2. **Focus on key economic models**: Economics often relies on models to simplify real-world phenomena\n3. **Practice problems**: Work through examples and exercises to reinforce concepts\n4. **Make connections**: Try to relate economic concepts to current events or real-world applications\n5. **Review regularly**: Economics builds on previous concepts, so regular review is essential\n\nOnce you share more details about the specific book, I can provide more targeted guidance!', '2025-10-16 23:46:01'),
(20, 32, '[MATERIAL ADDED] New Book (pdf) from Economics', '\nI\'d be happy to help you understand your economics study materials! However, I don\'t have access to the specific content of the \"New Book\" PDF you\'ve mentioned. To provide you with the most accurate guidance, I would need to see the actual material or at least have some information about its contents.\n\nIn the meantime, here\'s some general advice for studying economics materials:\n\n1. **Skim first**: Start by reading the table of contents, introduction, and conclusion to get an overview of the topics covered.\n\n2. **Look for key sections**: Economics books often cover fundamental areas like:\n   - Microeconomics (supply and demand, market structures)\n   - Macroeconomics (GDP, inflation, unemployment)\n   - Economic theories and models\n   - Current economic issues and applications\n\n3. **Active reading approach**:\n   - Take notes as you read\n   - Summarize key concepts in your own words\n   - Create flashcards for important terms and theories\n\n4. **Connect concepts**: Economics builds on itself, so try to see how different topics relate to each other.\n\nIf you could share some details about the book (such as the title, author, or a brief description of its contents), I could provide more specific guidance on what topics it likely covers and how to approach studying it effectively.', '2025-10-16 23:46:09'),
(21, 32, 'hello', 'Hello Mahe! 👋 I\'d be happy to help you with your economics studies. \n\nI noticed you mentioned adding a \"New Book (pdf) from Economics\" to our conversation. While I don\'t have direct access to the PDF content itself, I\'m here to help you understand economics concepts, answer questions about materials, and support your learning journey.\n\nWould you like to:\n- Share a specific concept from your economics book that you\'d like to understand better?\n- Ask about study strategies for economics?\n- Discuss particular topics you\'re covering in your course?\n\nLet me know how I can best assist you today! 📚✨', '2025-10-16 23:46:52'),
(22, 32, 'tell me about economics', 'Hello! I\'d be happy to explain economics to you. Economics is a fascinating social science that studies how individuals, businesses, governments, and societies make choices about allocating **limited resources** to satisfy **unlimited wants and needs**.\n\nHere\'s a breakdown of key aspects:\n\n### Core Concept\n**Scarcity** is the central problem: Resources (time, money, materials, labor) are limited, but human desires are not. Economics explores how we make decisions about what to produce, how to produce it, and who gets it.\n\n### Major Branches\n1. **Microeconomics**:\n   - Focuses on individual units (households, firms, markets)\n   - Studies topics like: supply/demand, pricing, consumer behavior, production costs, market structures (competition, monopoly)\n\n2. **Macroeconomics**:\n   - Examines the economy as a whole\n   - Studies topics like: GDP, inflation, unemployment, economic growth, fiscal/monetary policy, international trade\n\n### Fundamental Concepts\n- **Opportunity Cost**: The value of the next best alternative you give up when making a choice\n- **Incentives**: Rewards (or penalties) that influence behavior\n- **Marginal Thinking**: Decisions based on the costs and benefits of small changes\n- **Supply & Demand**: The relationship between how much of something is available (supply) and how much people want (demand)\n\n### Why Economics Matters\n- Helps individuals make better personal finance decisions\n- Guides business strategy and investment\n- Informs government policies (taxes, regulations, spending)\n- Explains global issues (poverty, inequality, environmental challenges)\n- Predicts market trends and business cycles\n\n### Real-World Applications\n- Why do concert tickets sometimes cost $50 or $500?\n- How do interest rates affect your savings and loans?\n- Why do some countries grow richer while others remain poor?\n- How do minimum wage laws affect employment?\n\nIf you\'d like to explore any specific concept in more detail, or if you have questions about your economics course material, just let me know! What aspect interests you most?', '2025-10-16 23:48:17'),
(23, 32, 'What are the classification in economics?', '\nEconomics is classified into several categories based on different criteria. Here\'s a clear breakdown of the main classifications:\n\n### 1. **Branches of Economics**\n   - **Microeconomics**:  \n     Studies individual units like households, firms, and markets.  \n     *Examples:* Supply/demand, consumer behavior, production costs, market structures (monopoly, competition).  \n   - **Macroeconomics**:  \n     Examines the economy as a whole.  \n     *Examples:* GDP, inflation, unemployment, monetary/fiscal policy, economic growth.  \n   - **International Economics**:  \n     Focuses on trade, exchange rates, and global markets.  \n     *Examples:* Comparative advantage, balance of payments, tariffs.  \n   - **Development Economics**:  \n     Studies economic growth in low-income countries.  \n     *Examples:* Poverty reduction, infrastructure investment, institutional reform.  \n   - **Environmental Economics**:  \n     Analyzes environmental issues through an economic lens.  \n     *Examples:* Carbon taxes, pollution regulations, resource sustainability.  \n\n---\n\n### 2. **Methodological Approaches**\n   - **Positive Economics**:  \n     Describes \"what is\" (objective, testable statements).  \n     *Example:* \"A minimum wage increase raises unemployment.\"  \n   - **Normative Economics**:  \n     Expresses \"what ought to be\" (subjective, value-based opinions).  \n     *Example:* \"Governments should raise the minimum wage to reduce poverty.\"  \n\n---\n\n### 3. **Scope of Study**\n   - **Theoretical Economics**:  \n     Develops models and theories (e.g., game theory, general equilibrium).  \n   - **Applied Economics**:  \n     Uses theories to solve real-world problems (e.g., healthcare policy, tax reforms).  \n   - **Quantitative Economics**:  \n     Employs statistical/mathematical tools (e.g., econometrics, data analysis).  \n\n---\n\n### 4. **Time Horizon**\n   - **Short-run Economics**:  \n     Focuses on immediate effects (e.g., quarterly GDP changes).  \n   - **Long-run Economics**:  \n     Examines persistent trends (e.g., technological progress, capital accumulation).  \n\n---\n\n### 5. **Schools of Thought**\n   - **Classical Economics** (Smith, Ricardo):  \n     Emphasizes free markets and self-regulating economies.  \n   - **Keynesian Economics** (Keynes):  \n     Advocates government intervention to stabilize the economy.  \n   - **Monetarism** (Friedman):  \n     Prioritizes controlling money supply over fiscal policy.  \n   - **Behavioral Economics**:  \n     Integrates psychology into economic models (e.g., biases in decision-making).  \n\n---\n\n### Why Classifications Matter:\nThese categories help economists:  \n- Organize knowledge systematically  \n- Target specific problems (e.g., poverty vs. inflation)  \n- Apply appropriate tools (e.g., statistics for empirical research)  \n- Debate policy solutions (e.g., Keynesian vs. classical approaches)  \n\n**Example in Practice**:  \nWhen studying climate change, an economist might:  \n- Use *microeconomics* to analyze firm-level pollution costs  \n- Apply *environmental economics* to design carbon taxes  \n- Rely on *quantitative methods* to model policy impacts  \n\nLet me know if you\'d like deeper exploration of any category! 📊', '2025-10-17 00:08:37'),
(24, 32, 'Tell me about Psychology', 'Psychology is the scientific study of the **mind and behavior**, exploring how humans (and sometimes animals) think, feel, perceive, learn, develop, and interact with others. It bridges natural sciences (biology, neuroscience) and social sciences (sociology, anthropology) to understand the complexities of human experience.\n\n### Core Areas of Psychology:\n1. **Clinical Psychology**:  \n   - Focuses on diagnosing and treating mental, emotional, and behavioral disorders (e.g., depression, anxiety).  \n   - Uses therapy (CBT, psychoanalysis) and assessment tools.  \n\n2. **Cognitive Psychology**:  \n   - Studies mental processes: memory, attention, problem-solving, language, and decision-making.  \n   - *Example*: How we remember a phone number or solve a puzzle.  \n\n3. **Social Psychology**:  \n   - Examines how individuals’ thoughts, feelings, and behaviors are influenced by others.  \n   - *Example*: Conformity (Asch experiment), prejudice, group dynamics.  \n\n4. **Developmental Psychology**:  \n   - Explores human growth across the lifespan (infancy to old age).  \n   - Topics: Attachment, identity formation, aging.  \n\n5. **Behavioral Psychology**:  \n   - Studies observable behaviors and how they’re shaped by environment (rewards/punishments).  \n   - *Example*: Training a dog or modifying habits.  \n\n6. **Biological Psychology**:  \n   - Investigates the brain, nervous system, and genetics’ role in behavior.  \n   - *Example*: How stress hormones affect mood.  \n\n7. **Industrial-Organizational (I/O) Psychology**:  \n   - Applies psychology to workplaces: improving productivity, leadership, and employee well-being.  \n\n8. **Forensic Psychology**:  \n   - Combines psychology with legal systems (e.g., criminal profiling, jury decision-making).  \n\n---\n\n### Key Concepts & Theories:\n- **Nature vs. Nurture**: How genetics (nature) and environment (nurture) shape behavior.  \n- **Unconscious Mind**: Freud’s theory that hidden drives influence actions.  \n- **Cognitive Dissonance**: Mental discomfort from holding conflicting beliefs (e.g., smoking despite knowing risks).  \n- **Classical Conditioning**: Learning through association (Pavlov’s dogs).  \n- **Hierarchy of Needs**: Maslow’s theory of motivation (basic → self-actualization).  \n\n---\n\n### Research Methods:\nPsychologists use scientific approaches to test hypotheses:  \n- **Experiments**: Controlled conditions to establish causality.  \n- **Surveys & Questionnaires**: Gather self-reported data.  \n- **Observational Studies**: Naturalistic or controlled observation.  \n- **Neuroimaging**: fMRI, EEG to study brain activity.  \n\n---\n\n### Why Psychology Matters:\n- **Personal Growth**: Self-awareness, emotional intelligence, and resilience.  \n- **Improved Relationships**: Understanding empathy, communication, and conflict resolution.  \n- **Mental Health**: Reducing stigma and promoting evidence-based treatments.  \n- **Societal Impact**: Informing education, policy, and workplace culture.  \n\n> 💡 **Fun Fact**: The term \"psychology\" comes from Greek: *psyche* (mind/soul) + *logos* (study).  \n\nIf you’d like to dive deeper into a specific area (e.g., cognitive biases, therapy types, or famous experiments), just ask! 😊', '2025-10-17 00:20:55'),
(25, 33, 'hello', 'Hello Mark! It\'s great to see you here on the ELMS Learning Platform. \n\nI\'m your AI Learning Assistant, here to help you with any questions about your coursework, homework, assignments, or learning concepts. Whether you need help understanding a topic, working through a problem, or just want some study tips, I\'m ready to assist!\n\nWhat can I help you with today? Are you working on a particular subject or assignment that you\'d like some guidance on?', '2025-10-17 02:32:09');

-- --------------------------------------------------------

--
-- Table structure for table `ai_user_context`
--

CREATE TABLE `ai_user_context` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `context_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`context_json`)),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_user_context`
--

INSERT INTO `ai_user_context` (`id`, `user_id`, `context_json`, `updated_at`) VALUES
(1, 9, '{\"courses\": [\"Advanced React Development\", \"Machine Learning Fundamentals\", \"Database Design\"], \"current_topics\": [\"React Hooks\", \"Linear Regression\"], \"skill_level\": \"intermediate\", \"preferred_learning_style\": \"hands-on\", \"recent_struggles\": [\"useEffect dependencies\", \"SQL joins\"]}', '2025-09-30 19:01:16'),
(2, 10, '{\"courses\": [\"Advanced React Development\", \"Machine Learning Fundamentals\"], \"current_topics\": [\"Component Optimization\", \"Data Preprocessing\"], \"skill_level\": \"advanced\", \"preferred_learning_style\": \"theoretical\", \"recent_struggles\": [\"Performance optimization\"]}', '2025-09-30 19:01:16'),
(3, 11, '{\"courses\": [\"Advanced React Development\", \"Database Design\", \"Data Structures\"], \"current_topics\": [\"React Patterns\", \"Database Normalization\"], \"skill_level\": \"beginner\", \"preferred_learning_style\": \"visual\", \"recent_struggles\": [\"Complex SQL queries\"]}', '2025-09-30 19:01:16'),
(4, 32, '{\"lastQuery\":\"ok, what is your name?\",\"lastResponse\":\"\\nHello! I\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, answer questions about course materials, and provide guidance with assignments. How can I assist you today?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:25:21.244Z\"}', '2025-10-16 23:25:21'),
(5, 32, '{\"lastQuery\":\"Hello\",\"lastResponse\":\"Hello again! I\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, and assist with any assignments or questions you might have. How can I support you today?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:26:37.276Z\"}', '2025-10-16 23:26:37'),
(6, 32, '{\"lastQuery\":\"Hello\",\"lastResponse\":\"\\nHello! 👋 \\n\\nI\'m your AI Learning Assistant for the ELMS Learning Platform. I\'m here to help you with your studies, explain concepts, answer questions about course materials, and provide guidance with assignments. \\n\\nHow can I assist you today?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:29:20.841Z\"}', '2025-10-16 23:29:20'),
(7, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:33:19.490Z\"}', '2025-10-16 23:33:19'),
(8, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:33:19.977Z\"}', '2025-10-16 23:33:19'),
(9, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:33:31.285Z\"}', '2025-10-16 23:33:31'),
(10, 32, '{\"lastQuery\":\"tell me about econoics\",\"lastResponse\":\"\\n\\nEconomics is the social science that studies how individuals, businesses, governments, and societies make choices about allocating scarce resources to satisfy unlimited wants and needs.\\n\\n**Main Branches of Economics:**\\n\\n1. **Microeconomics**: Studies the behavior of individual economic agents (households, firms) and how they interact in specific markets.\\n   - Topics: Supply and demand, consumer choice, production costs, market structures\\n\\n2. **Macroeconomics**: Examines the economy as a whole.\\n   - Topics: GDP, inflation, unemployment, economic growth, fiscal and monetary policy\\n\\n**Key Concepts:**\\n- **Scarcity**: The fundamental economic problem that resources are limited while wants are unlimited\\n- **Opportunity Cost**: The value of the next best alternative foregone when making a decision\\n- **Incentives**: Factors that motivate economic behavior\\n- **Markets**: Systems where buyers and sellers interact\\n- **Efficiency**: Using resources to maximize output or satisfaction\\n\\nEconomics helps us understand important questions like:\\n- How are prices determined?\\n- Why do some countries grow while others don\'t?\\n- What causes unemployment?\\n- How should governments tax and spend?\\n\\nWould you like me to explain any specific concept in more detail, or help you understand how to approach studying economics based on your course material?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:33:42.728Z\"}', '2025-10-16 23:33:42'),
(11, 32, '{\"lastQuery\":\"hello\",\"lastResponse\":\"\\nHello! 👋 \\n\\nI\'m here to help you with your economics studies. I noticed you\'ve been working with a new economics textbook. How can I assist you today? Do you have questions about specific economic concepts, need help with homework, or would like study tips for your economics course?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:44:03.605Z\"}', '2025-10-16 23:44:03'),
(12, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:44:15.685Z\"}', '2025-10-16 23:44:15'),
(13, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:44:18.624Z\"}', '2025-10-16 23:44:18'),
(14, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:44:21.638Z\"}', '2025-10-16 23:44:21'),
(15, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:44:24.269Z\"}', '2025-10-16 23:44:24'),
(16, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:46:01.957Z\"}', '2025-10-16 23:46:01'),
(17, 32, '{\"addedMaterial\":{\"id\":24,\"title\":\"New Book\",\"type\":\"pdf\",\"course\":\"Economics\"},\"timestamp\":\"2025-10-16T17:46:09.402Z\"}', '2025-10-16 23:46:09'),
(18, 32, '{\"lastQuery\":\"hello\",\"lastResponse\":\"Hello Mahe! 👋 I\'d be happy to help you with your economics studies. \\n\\nI noticed you mentioned adding a \\\"New Book (pdf) from Economics\\\" to our conversation. While I don\'t have direct access to the PDF content itself, I\'m here to help you understand economics concepts, answer questions about materials, and support your learning journey.\\n\\nWould you like to:\\n- Share a specific concept from your economics book that you\'d like to understand better?\\n- Ask about study strategies for economics?\\n- Discuss particular topics you\'re covering in your course?\\n\\nLet me know how I can best assist you today! 📚✨\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:46:52.377Z\"}', '2025-10-16 23:46:52'),
(19, 32, '{\"lastQuery\":\"tell me about economics\",\"lastResponse\":\"Hello! I\'d be happy to explain economics to you. Economics is a fascinating social science that studies how individuals, businesses, governments, and societies make choices about allocating **limited resources** to satisfy **unlimited wants and needs**.\\n\\nHere\'s a breakdown of key aspects:\\n\\n### Core Concept\\n**Scarcity** is the central problem: Resources (time, money, materials, labor) are limited, but human desires are not. Economics explores how we make decisions about what to produce, how to produce it, and who gets it.\\n\\n### Major Branches\\n1. **Microeconomics**:\\n   - Focuses on individual units (households, firms, markets)\\n   - Studies topics like: supply/demand, pricing, consumer behavior, production costs, market structures (competition, monopoly)\\n\\n2. **Macroeconomics**:\\n   - Examines the economy as a whole\\n   - Studies topics like: GDP, inflation, unemployment, economic growth, fiscal/monetary policy, international trade\\n\\n### Fundamental Concepts\\n- **Opportunity Cost**: The value of the next best alternative you give up when making a choice\\n- **Incentives**: Rewards (or penalties) that influence behavior\\n- **Marginal Thinking**: Decisions based on the costs and benefits of small changes\\n- **Supply & Demand**: The relationship between how much of something is available (supply) and how much people want (demand)\\n\\n### Why Economics Matters\\n- Helps individuals make better personal finance decisions\\n- Guides business strategy and investment\\n- Informs government policies (taxes, regulations, spending)\\n- Explains global issues (poverty, inequality, environmental challenges)\\n- Predicts market trends and business cycles\\n\\n### Real-World Applications\\n- Why do concert tickets sometimes cost $50 or $500?\\n- How do interest rates affect your savings and loans?\\n- Why do some countries grow richer while others remain poor?\\n- How do minimum wage laws affect employment?\\n\\nIf you\'d like to explore any specific concept in more detail, or if you have questions about your economics course material, just let me know! What aspect interests you most?\",\"courseName\":null,\"timestamp\":\"2025-10-16T17:48:17.752Z\"}', '2025-10-16 23:48:17'),
(20, 32, '{\"lastQuery\":\"What are the classification in economics?\",\"lastResponse\":\"\\nEconomics is classified into several categories based on different criteria. Here\'s a clear breakdown of the main classifications:\\n\\n### 1. **Branches of Economics**\\n   - **Microeconomics**:  \\n     Studies individual units like households, firms, and markets.  \\n     *Examples:* Supply/demand, consumer behavior, production costs, market structures (monopoly, competition).  \\n   - **Macroeconomics**:  \\n     Examines the economy as a whole.  \\n     *Examples:* GDP, inflation, unemployment, monetary/fiscal policy, economic growth.  \\n   - **International Economics**:  \\n     Focuses on trade, exchange rates, and global markets.  \\n     *Examples:* Comparative advantage, balance of payments, tariffs.  \\n   - **Development Economics**:  \\n     Studies economic growth in low-income countries.  \\n     *Examples:* Poverty reduction, infrastructure investment, institutional reform.  \\n   - **Environmental Economics**:  \\n     Analyzes environmental issues through an economic lens.  \\n     *Examples:* Carbon taxes, pollution regulations, resource sustainability.  \\n\\n---\\n\\n### 2. **Methodological Approaches**\\n   - **Positive Economics**:  \\n     Describes \\\"what is\\\" (objective, testable statements).  \\n     *Example:* \\\"A minimum wage increase raises unemployment.\\\"  \\n   - **Normative Economics**:  \\n     Expresses \\\"what ought to be\\\" (subjective, value-based opinions).  \\n     *Example:* \\\"Governments should raise the minimum wage to reduce poverty.\\\"  \\n\\n---\\n\\n### 3. **Scope of Study**\\n   - **Theoretical Economics**:  \\n     Develops models and theories (e.g., game theory, general equilibrium).  \\n   - **Applied Economics**:  \\n     Uses theories to solve real-world problems (e.g., healthcare policy, tax reforms).  \\n   - **Quantitative Economics**:  \\n     Employs statistical/mathematical tools (e.g., econometrics, data analysis).  \\n\\n---\\n\\n### 4. **Time Horizon**\\n   - **Short-run Economics**:  \\n     Focuses on immediate effects (e.g., quarterly GDP changes).  \\n   - **Long-run Economics**:  \\n     Examines persistent trends (e.g., technological progress, capital accumulation).  \\n\\n---\\n\\n### 5. **Schools of Thought**\\n   - **Classical Economics** (Smith, Ricardo):  \\n     Emphasizes free markets and self-regulating economies.  \\n   - **Keynesian Economics** (Keynes):  \\n     Advocates government intervention to stabilize the economy.  \\n   - **Monetarism** (Friedman):  \\n     Prioritizes controlling money supply over fiscal policy.  \\n   - **Behavioral Economics**:  \\n     Integrates psychology into economic models (e.g., biases in decision-making).  \\n\\n---\\n\\n### Why Classifications Matter:\\nThese categories help economists:  \\n- Organize knowledge systematically  \\n- Target specific problems (e.g., poverty vs. inflation)  \\n- Apply appropriate tools (e.g., statistics for empirical research)  \\n- Debate policy solutions (e.g., Keynesian vs. classical approaches)  \\n\\n**Example in Practice**:  \\nWhen studying climate change, an economist might:  \\n- Use *microeconomics* to analyze firm-level pollution costs  \\n- Apply *environmental economics* to design carbon taxes  \\n- Rely on *quantitative methods* to model policy impacts  \\n\\nLet me know if you\'d like deeper exploration of any category! 📊\",\"courseName\":null,\"timestamp\":\"2025-10-16T18:08:37.931Z\"}', '2025-10-17 00:08:37'),
(21, 32, '{\"lastQuery\":\"Tell me about Psychology\",\"lastResponse\":\"Psychology is the scientific study of the **mind and behavior**, exploring how humans (and sometimes animals) think, feel, perceive, learn, develop, and interact with others. It bridges natural sciences (biology, neuroscience) and social sciences (sociology, anthropology) to understand the complexities of human experience.\\n\\n### Core Areas of Psychology:\\n1. **Clinical Psychology**:  \\n   - Focuses on diagnosing and treating mental, emotional, and behavioral disorders (e.g., depression, anxiety).  \\n   - Uses therapy (CBT, psychoanalysis) and assessment tools.  \\n\\n2. **Cognitive Psychology**:  \\n   - Studies mental processes: memory, attention, problem-solving, language, and decision-making.  \\n   - *Example*: How we remember a phone number or solve a puzzle.  \\n\\n3. **Social Psychology**:  \\n   - Examines how individuals’ thoughts, feelings, and behaviors are influenced by others.  \\n   - *Example*: Conformity (Asch experiment), prejudice, group dynamics.  \\n\\n4. **Developmental Psychology**:  \\n   - Explores human growth across the lifespan (infancy to old age).  \\n   - Topics: Attachment, identity formation, aging.  \\n\\n5. **Behavioral Psychology**:  \\n   - Studies observable behaviors and how they’re shaped by environment (rewards/punishments).  \\n   - *Example*: Training a dog or modifying habits.  \\n\\n6. **Biological Psychology**:  \\n   - Investigates the brain, nervous system, and genetics’ role in behavior.  \\n   - *Example*: How stress hormones affect mood.  \\n\\n7. **Industrial-Organizational (I/O) Psychology**:  \\n   - Applies psychology to workplaces: improving productivity, leadership, and employee well-being.  \\n\\n8. **Forensic Psychology**:  \\n   - Combines psychology with legal systems (e.g., criminal profiling, jury decision-making).  \\n\\n---\\n\\n### Key Concepts & Theories:\\n- **Nature vs. Nurture**: How genetics (nature) and environment (nurture) shape behavior.  \\n- **Unconscious Mind**: Freud’s theory that hidden drives influence actions.  \\n- **Cognitive Dissonance**: Mental discomfort from holding conflicting beliefs (e.g., smoking despite knowing risks).  \\n- **Classical Conditioning**: Learning through association (Pavlov’s dogs).  \\n- **Hierarchy of Needs**: Maslow’s theory of motivation (basic → self-actualization).  \\n\\n---\\n\\n### Research Methods:\\nPsychologists use scientific approaches to test hypotheses:  \\n- **Experiments**: Controlled conditions to establish causality.  \\n- **Surveys & Questionnaires**: Gather self-reported data.  \\n- **Observational Studies**: Naturalistic or controlled observation.  \\n- **Neuroimaging**: fMRI, EEG to study brain activity.  \\n\\n---\\n\\n### Why Psychology Matters:\\n- **Personal Growth**: Self-awareness, emotional intelligence, and resilience.  \\n- **Improved Relationships**: Understanding empathy, communication, and conflict resolution.  \\n- **Mental Health**: Reducing stigma and promoting evidence-based treatments.  \\n- **Societal Impact**: Informing education, policy, and workplace culture.  \\n\\n> 💡 **Fun Fact**: The term \\\"psychology\\\" comes from Greek: *psyche* (mind/soul) + *logos* (study).  \\n\\nIf you’d like to dive deeper into a specific area (e.g., cognitive biases, therapy types, or famous experiments), just ask! 😊\",\"courseName\":null,\"timestamp\":\"2025-10-16T18:20:55.431Z\"}', '2025-10-17 00:20:55'),
(22, 33, '{\"lastQuery\":\"hello\",\"lastResponse\":\"Hello Mark! It\'s great to see you here on the ELMS Learning Platform. \\n\\nI\'m your AI Learning Assistant, here to help you with any questions about your coursework, homework, assignments, or learning concepts. Whether you need help understanding a topic, working through a problem, or just want some study tips, I\'m ready to assist!\\n\\nWhat can I help you with today? Are you working on a particular subject or assignment that you\'d like some guidance on?\",\"courseName\":null,\"timestamp\":\"2025-10-16T20:32:09.996Z\"}', '2025-10-17 02:32:09');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `section_id`, `title`, `content`, `created_at`) VALUES
(1, 1, 'Welcome to Advanced React Development!', 'Welcome everyone! We will start with React hooks and gradually move to advanced patterns. Please join the class discussion group.', '2025-09-30 19:01:16'),
(2, 1, 'Assignment 1 Released', 'The first assignment on React Hooks is now available. Due date: Next Friday. Please check the materials section for details.', '2025-09-30 19:01:16'),
(3, 2, 'Lab Session Schedule', 'Lab sessions will be held every Tuesday and Thursday from 2:00 PM to 4:00 PM in Computer Lab 3.', '2025-09-30 19:01:16'),
(4, 3, 'Machine Learning Project Guidelines', 'For the semester project, you need to work in teams of 3-4 students. Project topics will be discussed in next class.', '2025-09-30 19:01:16'),
(5, 4, 'Dataset Links Updated', 'All dataset links for ML exercises have been updated in the materials section. Please download them before the next lab.', '2025-09-30 19:01:16'),
(6, 5, 'Database Schema Assignment', 'Design a database schema for an e-commerce system. Submission deadline: End of this week.', '2025-09-30 19:01:16'),
(7, 6, 'Security Workshop Next Week', 'We will have a special workshop on penetration testing next Monday. Attendance is mandatory.', '2025-09-30 19:01:16'),
(8, 7, 'Midterm Exam Schedule', 'Midterm exam will be held on 15th October 2024. Covers topics from Week 1-7.', '2025-09-30 19:01:16'),
(9, 8, 'Algorithm Competition', 'UIU Algorithm Competition registration is open. Participate to enhance your problem-solving skills!', '2025-09-30 19:01:16'),
(10, 9, 'Software Project Proposal', 'Submit your software project proposal by next Wednesday. Include technology stack and timeline.', '2025-09-30 19:01:16');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `total_marks` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `section_id`, `title`, `description`, `due_date`, `total_marks`, `created_at`) VALUES
(13, 1, 'test-1', 'it\'s a test to see if the assignment is published! Please WORK!', '2025-10-30 16:42:00', 100, '2025-10-13 22:42:11'),
(14, 10, 'Biology A-1 Lab', 'Test assignment', '2025-10-27 18:22:00', 100, '2025-10-15 00:23:01'),
(15, 10, 'Biology Lab Report', 'Write a comprehensive lab report on plant cell structure and function.', '2025-10-25 23:59:00', 100, '2025-10-15 01:22:41'),
(16, 10, 'Report on Human Cell', 'Read the pdf I uploaded and wirte a report about Human Cell. Tell me what you understand.', '2025-10-30 19:51:00', 100, '2025-10-15 01:51:29'),
(18, 15, 'T-1', 'Do it', '2025-10-27 16:36:00', 100, '2025-10-16 22:37:00'),
(19, 16, 'A-TT-1', 'Read the new book and write a report on it', '2025-10-18 18:17:00', 10, '2025-10-17 00:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` enum('assignment','exam','meeting','class') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `calendar_events`
--

INSERT INTO `calendar_events` (`id`, `section_id`, `title`, `description`, `date`, `type`, `created_at`) VALUES
(19, 1, 'Assignment Due: Biology A-1', 'Assignment \"Biology A-1\" submission deadline', '2025-10-27', 'assignment', '2025-10-15 00:23:01'),
(20, 10, 'Assignment Due: Biology A-1 Lab', 'Biology lab report assignment deadline', '2025-10-27', 'assignment', '2025-10-15 01:22:41'),
(21, 10, 'Assignment Due: Report on Human Cell', 'Assignment \"Report on Human Cell\" submission deadline', '2025-10-30', 'assignment', '2025-10-15 01:51:29'),
(22, 15, 'Assignment Due: Economics Test Assignment', 'Assignment \"Economics Test Assignment\" submission deadline', '2025-10-23', 'assignment', '2025-10-16 22:36:09'),
(23, 15, 'Assignment Due: T-1', 'Assignment \"T-1\" submission deadline', '2025-10-27', 'assignment', '2025-10-16 22:37:00'),
(24, 16, 'Assignment Due: A-TT-1', 'Assignment \"A-TT-1\" submission deadline', '2025-10-18', 'assignment', '2025-10-17 00:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL,
  `message` text DEFAULT NULL,
  `message_type` enum('text','image','file') NOT NULL DEFAULT 'text',
  `file_url` varchar(500) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `room_id`, `sender_id`, `message`, `message_type`, `file_url`, `timestamp`) VALUES
(1, 1, 9, 'Has anyone started working on the React hooks assignment yet?', 'text', NULL, '2024-10-10 10:30:00'),
(2, 1, 10, 'Yes, I\'m working on the useState part. The useEffect is a bit tricky though.', 'text', NULL, '2024-10-10 10:32:00'),
(3, 1, 3, 'Remember that useEffect runs after every render by default. Make sure to include the dependency array!', 'text', NULL, '2024-10-10 10:35:00'),
(4, 1, 11, 'Thanks Dr. Johnson! That clears up the confusion.', 'text', NULL, '2024-10-10 10:37:00'),
(5, 1, 12, 'Don\'t forget the submission deadline is tomorrow at 11:59 PM!', 'text', NULL, '2024-10-10 11:00:00'),
(6, 1, 13, 'Can we use external libraries like Material-UI for styling?', 'text', NULL, '2024-10-10 11:15:00'),
(7, 1, 3, 'Yes, you can use any UI library, but focus on implementing the hooks correctly.', 'text', NULL, '2024-10-10 11:18:00'),
(8, 3, 15, 'The linear regression dataset is quite large. Any tips for preprocessing?', 'text', NULL, '2024-10-09 14:20:00'),
(9, 3, 17, 'I used pandas for data cleaning. Check for null values and outliers first.', 'text', NULL, '2024-10-09 14:25:00'),
(10, 3, 4, 'Good advice! Also normalize your features for better convergence.', 'text', NULL, '2024-10-09 14:30:00'),
(11, 3, 19, 'Should we implement gradient descent from scratch or use built-in functions?', 'text', NULL, '2024-10-09 14:45:00'),
(12, 3, 4, 'Implement from scratch first to understand the math, then compare with sklearn.', 'text', NULL, '2024-10-09 14:50:00'),
(13, 5, 9, 'Anyone having trouble with the foreign key constraints in the e-commerce schema?', 'text', NULL, '2024-10-08 16:10:00'),
(14, 5, 21, 'Make sure your referenced columns have the same data type and are indexed.', 'text', NULL, '2024-10-08 16:15:00'),
(15, 5, 5, 'Great discussion! Remember to consider cascading deletes and updates carefully.', 'text', NULL, '2024-10-08 16:20:00'),
(16, 5, 22, 'Dr. Rodriguez, should we include audit tables for tracking changes?', 'text', NULL, '2024-10-08 16:25:00'),
(17, 5, 5, 'That\'s an excellent idea for a production system! Bonus points if you implement it.', 'text', NULL, '2024-10-08 16:30:00'),
(18, 6, 23, 'The OWASP Top 10 list is really eye-opening. SQL injection is everywhere!', 'text', NULL, '2024-10-07 13:40:00'),
(19, 6, 25, 'I found three SQL injection vulnerabilities in the test application already.', 'text', NULL, '2024-10-07 13:45:00'),
(20, 6, 6, 'Excellent work! Make sure to document the impact and remediation steps.', 'text', NULL, '2024-10-07 13:50:00'),
(21, 6, 24, 'Prof. Kim, will we cover XSS prevention techniques in the next class?', 'text', NULL, '2024-10-07 14:00:00'),
(22, 6, 6, 'Yes, we\'ll cover XSS, CSRF, and secure coding practices next week.', 'text', NULL, '2024-10-07 14:05:00'),
(24, 1, 32, 'Ok maam', 'text', NULL, '2025-10-16 19:38:14'),
(25, 11, 32, 'dsa', 'text', NULL, '2025-10-16 19:39:32'),
(26, 10, 32, 'Biology', 'text', NULL, '2025-10-16 19:39:43'),
(27, 3, 32, 'Ml is great!!!!', 'text', NULL, '2025-10-16 19:40:53'),
(29, 1, 10, 'Hello Mahe Alif', 'text', NULL, '2025-10-16 19:45:50'),
(30, 7, 10, 'Anyone here?', 'text', NULL, '2025-10-16 19:45:59'),
(31, 1, 32, 'Hello Fatima', 'text', NULL, '2025-10-16 19:46:57'),
(32, 10, 32, 'Hello my mates? I hate Biology', 'text', NULL, '2025-10-16 20:32:25'),
(34, 12, 33, 'Hello, I am Mark', 'text', NULL, '2025-10-16 21:03:39'),
(35, 12, 29, 'Hello, I am a test user. I hate Biology', 'text', NULL, '2025-10-16 21:05:03'),
(36, 12, 33, 'Yeah, I hate it too', 'text', NULL, '2025-10-16 21:10:56'),
(37, 12, 29, 'It\'s a good thing to hate Biology', 'text', NULL, '2025-10-16 21:32:55'),
(38, 13, 33, 'Hello bro?', 'text', NULL, '2025-10-16 22:19:05'),
(39, 13, 32, 'Yep, chat is working!', 'text', NULL, '2025-10-16 22:19:56'),
(40, 13, 32, 'Hello mark', 'text', NULL, '2025-10-17 00:21:39'),
(41, 14, 32, 'Hello', 'text', NULL, '2025-10-17 00:21:58'),
(42, 14, 33, 'Hello Mahe', 'text', NULL, '2025-10-17 00:23:16'),
(43, 14, 33, 'Oi, kalker pora kire?', 'text', NULL, '2025-10-17 02:03:40'),
(44, 14, 32, 'jani nare!!!!!!', 'text', NULL, '2025-10-17 02:04:54');

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `section_id`, `name`) VALUES
(1, 1, 'React Dev - Section A Discussion'),
(2, 2, 'React Dev - Section B Discussion'),
(3, 3, 'ML Fundamentals - Section A'),
(4, 4, 'ML Fundamentals - Section B'),
(5, 5, 'Database Design Discussion'),
(6, 6, 'Web Security Forum'),
(7, 7, 'Data Structures - Section A'),
(8, 8, 'Data Structures - Section B'),
(9, 9, 'Software Engineering Chat'),
(10, 10, 'Bio-201 - Section A Chat'),
(11, 12, 'CSE-2201 - Section A Chat'),
(12, 14, 'Bio-201 - Section B Chat'),
(13, 15, 'A Chat'),
(14, 16, 'B Chat');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` bigint(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `course_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `credits` int(11) DEFAULT 3,
  `semester` enum('Fall','Spring','Summer') DEFAULT 'Fall',
  `academic_year` varchar(9) DEFAULT '2024-2025',
  `teacher_id` bigint(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `course_code`, `description`, `credits`, `semester`, `academic_year`, `teacher_id`, `color`, `created_at`, `updated_at`) VALUES
(1, 'Advanced React Development', 'CSE-4101', 'Deep dive into React hooks, context, performance optimization, and modern patterns', 3, 'Fall', '2024-2025', 3, 'bg-gradient-to-r from-cyan-500 to-blue-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(2, 'Machine Learning Fundamentals', 'CSE-4201', 'Introduction to ML algorithms, data science, and practical applications', 3, 'Fall', '2024-2025', 4, 'bg-gradient-to-r from-purple-500 to-pink-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(3, 'Database Design & SQL', 'CSE-3301', 'Relational database concepts, advanced SQL queries, and optimization techniques', 3, 'Fall', '2024-2025', 31, 'bg-gradient-to-r from-green-500 to-teal-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(4, 'Web Security & Cryptography', 'CSE-4401', 'Modern web security practices, cryptographic protocols, and ethical hacking', 3, 'Fall', '2024-2025', 6, 'bg-gradient-to-r from-orange-500 to-red-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(5, 'Data Structures & Algorithms', 'CSE-2501', 'Advanced data structures, algorithm design, and complexity analysis', 3, 'Fall', '2024-2025', 7, 'bg-gradient-to-r from-indigo-500 to-purple-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(6, 'Software Engineering Principles', 'CSE-3601', 'Software development lifecycle, design patterns, and project management', 3, 'Fall', '2024-2025', 8, 'bg-gradient-to-r from-yellow-500 to-orange-500', '2025-09-30 19:01:16', '2025-10-15 00:52:24'),
(7, 'Biology', 'Bio-201', 'Teaches biology for Engineers', 3, 'Fall', '2024-2025', 3, 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-03 18:28:17', '2025-10-15 00:17:21'),
(8, 'Psychology', 'Psy-231', 'It\'s about psychology, you know how human behaves', 3, 'Fall', '2024-2025', 5, 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-03 18:35:45', '2025-10-03 18:36:01'),
(9, 'Data Structures and Algorithms', 'CSE-2201', 'Data Structures and Algorithms (DSA) is a fundamental part of Computer Science that teaches you how to think and solve complex problems systematically. Using the right data structure and algorithm makes your program run faster, especially when working with lots of data.', 3, 'Fall', '2024-2025', 3, 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-16 19:10:37', '2025-10-16 19:11:08'),
(10, 'Economics', 'ECO-2011', 'An economics course provides a framework for understanding how societies use scarce resources and covers topics like microeconomics, macroeconomics, econometrics, and public policy', 3, 'Fall', '2024-2025', 5, 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20', '2025-10-16 22:04:09', '2025-10-17 01:27:28');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `section_id` bigint(20) DEFAULT NULL,
  `enrolled_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `section_id`, `enrolled_at`) VALUES
(1, 9, NULL, 1, '2025-09-30 19:01:16'),
(2, 10, NULL, 1, '2025-09-30 19:01:16'),
(3, 11, NULL, 1, '2025-09-30 19:01:16'),
(4, 12, NULL, 1, '2025-09-30 19:01:16'),
(5, 13, NULL, 1, '2025-09-30 19:01:16'),
(6, 14, NULL, 1, '2025-09-30 19:01:16'),
(7, 15, NULL, 1, '2025-09-30 19:01:16'),
(8, 16, NULL, 1, '2025-09-30 19:01:16'),
(9, 17, NULL, 1, '2025-09-30 19:01:16'),
(10, 18, NULL, 1, '2025-09-30 19:01:16'),
(11, 19, NULL, 2, '2025-09-30 19:01:16'),
(12, 20, NULL, 2, '2025-09-30 19:01:16'),
(13, 21, NULL, 2, '2025-09-30 19:01:16'),
(14, 22, NULL, 2, '2025-09-30 19:01:16'),
(15, 23, NULL, 2, '2025-09-30 19:01:16'),
(16, 24, NULL, 2, '2025-09-30 19:01:16'),
(17, 25, NULL, 2, '2025-09-30 19:01:16'),
(18, 26, NULL, 2, '2025-09-30 19:01:16'),
(19, 27, NULL, 2, '2025-09-30 19:01:16'),
(20, 28, NULL, 2, '2025-09-30 19:01:16'),
(21, 9, NULL, 3, '2025-09-30 19:01:16'),
(22, 11, NULL, 3, '2025-09-30 19:01:16'),
(23, 13, NULL, 3, '2025-09-30 19:01:16'),
(24, 15, NULL, 3, '2025-09-30 19:01:16'),
(25, 17, NULL, 3, '2025-09-30 19:01:16'),
(26, 19, NULL, 3, '2025-09-30 19:01:16'),
(27, 21, NULL, 3, '2025-09-30 19:01:16'),
(28, 23, NULL, 3, '2025-09-30 19:01:16'),
(29, 25, NULL, 3, '2025-09-30 19:01:16'),
(30, 27, NULL, 3, '2025-09-30 19:01:16'),
(31, 10, NULL, 4, '2025-09-30 19:01:16'),
(32, 12, NULL, 4, '2025-09-30 19:01:16'),
(33, 14, NULL, 4, '2025-09-30 19:01:16'),
(34, 16, NULL, 4, '2025-09-30 19:01:16'),
(35, 18, NULL, 4, '2025-09-30 19:01:16'),
(36, 20, NULL, 4, '2025-09-30 19:01:16'),
(37, 22, NULL, 4, '2025-09-30 19:01:16'),
(38, 24, NULL, 4, '2025-09-30 19:01:16'),
(39, 26, NULL, 4, '2025-09-30 19:01:16'),
(40, 28, NULL, 4, '2025-09-30 19:01:16'),
(41, 9, NULL, 5, '2025-09-30 19:01:16'),
(42, 10, NULL, 5, '2025-09-30 19:01:16'),
(43, 11, NULL, 5, '2025-09-30 19:01:16'),
(44, 12, NULL, 5, '2025-09-30 19:01:16'),
(45, 19, NULL, 5, '2025-09-30 19:01:16'),
(46, 20, NULL, 5, '2025-09-30 19:01:16'),
(47, 21, NULL, 5, '2025-09-30 19:01:16'),
(48, 22, NULL, 5, '2025-09-30 19:01:16'),
(49, 13, NULL, 6, '2025-09-30 19:01:16'),
(50, 14, NULL, 6, '2025-09-30 19:01:16'),
(51, 15, NULL, 6, '2025-09-30 19:01:16'),
(52, 16, NULL, 6, '2025-09-30 19:01:16'),
(53, 23, NULL, 6, '2025-09-30 19:01:16'),
(54, 24, NULL, 6, '2025-09-30 19:01:16'),
(55, 25, NULL, 6, '2025-09-30 19:01:16'),
(56, 26, NULL, 6, '2025-09-30 19:01:16'),
(57, 17, NULL, 7, '2025-09-30 19:01:16'),
(58, 18, NULL, 7, '2025-09-30 19:01:16'),
(59, 27, NULL, 7, '2025-09-30 19:01:16'),
(60, 28, NULL, 7, '2025-09-30 19:01:16'),
(61, 9, NULL, 7, '2025-09-30 19:01:16'),
(62, 10, NULL, 7, '2025-09-30 19:01:16'),
(63, 19, NULL, 8, '2025-09-30 19:01:16'),
(64, 20, NULL, 8, '2025-09-30 19:01:16'),
(65, 21, NULL, 8, '2025-09-30 19:01:16'),
(66, 22, NULL, 8, '2025-09-30 19:01:16'),
(67, 11, NULL, 8, '2025-09-30 19:01:16'),
(68, 12, NULL, 8, '2025-09-30 19:01:16'),
(69, 23, NULL, 9, '2025-09-30 19:01:16'),
(70, 24, NULL, 9, '2025-09-30 19:01:16'),
(71, 25, NULL, 9, '2025-09-30 19:01:16'),
(72, 26, NULL, 9, '2025-09-30 19:01:16'),
(73, 13, NULL, 9, '2025-09-30 19:01:16'),
(74, 14, NULL, 9, '2025-09-30 19:01:16'),
(75, 15, NULL, 9, '2025-09-30 19:01:16'),
(76, 16, NULL, 9, '2025-09-30 19:01:16'),
(77, 30, 7, 10, '2025-10-03 18:30:17'),
(78, 29, 8, 11, '2025-10-03 18:36:31'),
(79, 17, 8, 11, '2025-10-03 18:36:59'),
(80, 17, 7, 10, '2025-10-03 19:32:25'),
(81, 17, 3, 5, '2025-10-03 19:44:44'),
(82, 30, 3, 5, '2025-10-03 19:44:56'),
(83, 16, 3, 5, '2025-10-03 19:45:06'),
(90, 32, NULL, 1, '2025-10-13 23:41:16'),
(91, 32, NULL, 3, '2025-10-13 23:41:16'),
(92, 18, 7, 10, '2025-10-14 02:54:57'),
(93, 32, NULL, 10, '2025-10-15 01:22:41'),
(94, 32, 9, 12, '2025-10-16 19:11:20'),
(95, 18, 9, 12, '2025-10-16 19:11:31'),
(96, 17, 9, 12, '2025-10-16 19:11:41'),
(97, 16, 9, 12, '2025-10-16 19:11:50'),
(98, 15, 9, 12, '2025-10-16 19:11:59'),
(99, 29, NULL, 14, '2025-10-16 20:51:44'),
(100, 11, NULL, 14, '2025-10-16 20:55:14'),
(101, 33, NULL, 14, '2025-10-16 21:02:41'),
(102, 33, NULL, 15, '2025-10-16 22:05:01'),
(103, 32, NULL, 15, '2025-10-16 22:05:17'),
(104, 18, NULL, 15, '2025-10-16 22:05:39'),
(105, 17, NULL, 15, '2025-10-16 22:05:51'),
(106, 33, NULL, 16, '2025-10-17 00:13:51'),
(107, 32, NULL, 16, '2025-10-17 00:14:26');

-- --------------------------------------------------------

--
-- Table structure for table `materials`
--

CREATE TABLE `materials` (
  `id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('pdf','doc','ppt','video','other') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  `upload_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials`
--

INSERT INTO `materials` (`id`, `section_id`, `title`, `type`, `file_path`, `size`, `upload_date`) VALUES
(19, 1, 'New PDF for React', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\à§§à§¦à¦® à¦¶à§à¦°à§à¦£à§ à¦¬à¦¾à¦à¦²à¦¾ à§¨à§ à¦ªà¦¤à§à¦°-1760367086163-801090339.pdf', '32072', '2025-10-13 20:51:26'),
(20, 1, 'Test pdf', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Git_Exam_CheatSheet-1760370124869-409554123.pdf', '3788', '2025-10-13 21:42:04'),
(21, 1, 'Test-2 PDF', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Git_Lab_Manual-1760370583602-198120720.pdf', '162630', '2025-10-13 21:49:43'),
(22, 1, '50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced-1760371201561-298032114.pdf', '774529', '2025-10-13 22:00:01'),
(23, 10, 'New Book for Cells', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\1_Fundamentals of Cell-1760471416626-52438030.pdf', '1834808', '2025-10-15 01:50:16'),
(24, 15, 'New Book', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\Equilibrium Under Monopoly-1760632601148-464913508.pdf', '226458', '2025-10-16 22:36:41'),
(25, 16, 'TT-1', 'pdf', 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\materials\\3. (PSY) chapter six LEARNING-1760638638517-787405809.pdf', '4130461', '2025-10-17 00:17:18');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `type` enum('assignment','due_event','reminder','grade_posted') NOT NULL,
  `message` text DEFAULT NULL,
  `read_status` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `message`, `read_status`, `created_at`) VALUES
(1, 9, 'assignment', 'New assignment \"React Hooks Implementation\" has been posted in Advanced React Development', 0, '2025-09-30 19:01:16'),
(2, 9, 'due_event', 'Assignment \"Database Schema Design\" is due in 2 days', 0, '2025-09-30 19:01:16'),
(3, 9, 'grade_posted', 'Your submission for \"React Hooks Implementation\" has been graded: 85/100', 1, '2025-09-30 19:01:16'),
(4, 10, 'assignment', 'New assignment \"Component Library Creation\" has been posted', 0, '2025-09-30 19:01:16'),
(5, 10, 'grade_posted', 'Your submission for \"React Hooks Implementation\" has been graded: 92/100', 1, '2025-09-30 19:01:16'),
(6, 10, 'reminder', 'Don\'t forget to attend tomorrow\'s ML workshop at 2 PM', 0, '2025-09-30 19:01:16'),
(7, 11, 'assignment', 'New assignment \"Linear Regression Analysis\" is now available', 0, '2025-09-30 19:01:16'),
(8, 11, 'grade_posted', 'Your submission for \"Database Schema Design\" has been graded: 95/100', 1, '2025-09-30 19:01:16'),
(9, 11, 'due_event', 'Assignment \"Algorithm Implementation Portfolio\" is due in 5 days', 0, '2025-09-30 19:01:16'),
(10, 12, 'grade_posted', 'Your submission for \"React Hooks Implementation\" has been graded: 88/100', 1, '2025-09-30 19:01:16'),
(11, 12, 'assignment', 'New assignment \"Query Optimization Challenge\" has been posted', 0, '2025-09-30 19:01:16'),
(12, 3, 'reminder', 'You have 15 pending submissions to grade in Advanced React Development', 0, '2025-09-30 19:01:16'),
(13, 4, 'reminder', 'Midterm exam for Machine Learning Fundamentals is scheduled for next week', 0, '2025-09-30 19:01:16'),
(14, 5, 'reminder', 'New student enrolled in Database Design & SQL - Section A', 1, '2025-09-30 19:01:16'),
(15, 3, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(16, 4, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(17, 5, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(18, 6, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(19, 7, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(20, 8, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(21, 9, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(22, 10, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(23, 11, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(24, 12, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(25, 13, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(26, 14, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(27, 15, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(28, 16, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(29, 17, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(30, 18, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(31, 19, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(32, 20, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(33, 21, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(34, 22, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(35, 23, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(36, 24, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(37, 25, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(38, 26, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(39, 27, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(40, 28, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(41, 29, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(42, 30, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(43, 31, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(44, 32, 'due_event', 'University Event: Test event - October 20, 2025', 0, '2025-10-14 23:41:50'),
(46, 3, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(47, 4, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(48, 5, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(49, 6, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(50, 7, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(51, 8, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(52, 9, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(53, 10, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(54, 11, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(55, 12, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(56, 13, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(57, 14, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(58, 15, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(59, 16, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(60, 17, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(61, 18, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(62, 19, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(63, 20, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(64, 21, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(65, 22, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(66, 23, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(67, 24, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(68, 25, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(69, 26, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(70, 27, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(71, 28, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(72, 29, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(73, 30, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(74, 31, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(75, 32, 'due_event', 'University Event: 2nd final exam - October 25, 2025', 0, '2025-10-15 00:16:19'),
(76, 3, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(77, 4, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(78, 5, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(79, 6, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(80, 7, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(81, 8, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(82, 9, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(83, 10, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(84, 11, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(85, 12, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(86, 13, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(87, 14, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(88, 15, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(89, 16, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(90, 17, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(91, 18, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(92, 19, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(93, 20, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(94, 21, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(95, 22, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(96, 23, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(97, 24, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(98, 25, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(99, 26, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(100, 27, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(101, 28, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(102, 29, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(103, 30, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(104, 31, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(105, 32, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(106, 33, 'due_event', 'University Event: Meet - October 30, 2025', 0, '2025-10-17 00:28:20'),
(107, 3, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(108, 4, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(109, 5, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(110, 6, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(111, 7, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(112, 8, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(113, 9, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(114, 10, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(115, 11, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(116, 12, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(117, 13, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(118, 14, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(119, 15, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(120, 16, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(121, 17, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(122, 18, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(123, 19, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(124, 20, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(125, 21, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(126, 22, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(127, 23, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(128, 24, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(129, 25, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(130, 26, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(131, 27, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(132, 28, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(133, 29, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(134, 30, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(135, 31, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(136, 32, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11'),
(137, 33, 'due_event', 'University Event: Meet-2 - October 31, 2025', 0, '2025-10-17 00:29:11');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL COMMENT 'Teacher assigned to this section',
  `name` varchar(100) NOT NULL,
  `max_capacity` int(11) DEFAULT 50 COMMENT 'Maximum students allowed in this section',
  `current_enrollment` int(11) DEFAULT 0 COMMENT 'Current number of enrolled students',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `course_id`, `teacher_id`, `name`, `max_capacity`, `current_enrollment`, `created_at`) VALUES
(1, 1, 3, 'CSE 4101 - Section A', 50, 11, '2025-09-30 19:01:16'),
(2, 1, 3, 'CSE 4101 - Section B', 50, 10, '2025-09-30 19:01:16'),
(3, 2, 4, 'CSE 4201 - Section A', 50, 11, '2025-09-30 19:01:16'),
(4, 2, 4, 'CSE 4201 - Section B', 50, 10, '2025-09-30 19:01:16'),
(5, 3, 31, 'CSE 3301 - Section A', 50, 11, '2025-09-30 19:01:16'),
(6, 4, 6, 'CSE 4401 - Section A', 50, 8, '2025-09-30 19:01:16'),
(7, 5, 7, 'CSE 2501 - Section A', 50, 6, '2025-09-30 19:01:16'),
(8, 5, 7, 'CSE 2501 - Section B', 50, 6, '2025-09-30 19:01:16'),
(9, 6, 8, 'CSE 3601 - Section A', 50, 8, '2025-09-30 19:01:16'),
(10, 7, 3, 'Bio-201 - Section A', 50, 4, '2025-10-15 01:22:41'),
(11, 8, 5, 'Psy-231 - Section A', 50, 2, '2025-10-16 19:30:42'),
(12, 9, 3, 'CSE-2201 - Section A', 50, 5, '2025-10-16 19:30:42'),
(14, 7, 7, 'Bio-201 - Section B', 50, 3, '2025-10-16 20:37:52'),
(15, 10, 3, 'A', 50, 4, '2025-10-16 22:04:22'),
(16, 8, 3, 'B', 10, 2, '2025-10-17 00:11:53');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` bigint(20) NOT NULL,
  `assignment_id` bigint(20) NOT NULL,
  `student_id` bigint(20) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `grade` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `graded_at` datetime DEFAULT NULL,
  `graded_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `assignment_id`, `student_id`, `file_path`, `submitted_at`, `grade`, `feedback`, `graded_at`, `graded_by`) VALUES
(19, 13, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\50-ReactJS-Interview-Questions-2024_-Common-Basic-Advanced (1)-1760382167399-932678554.pdf', '2025-10-14 01:02:47', 80, 'good, but needs improvement', '2025-10-14 02:22:27', 3),
(21, 13, 18, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\BDRAILWAY_TICKET417151171140-71433-461311-1161214-301416713127171011-1760388949824-865721813.pdf', '2025-10-14 02:55:49', 50, 'Needs more work!', '2025-10-14 02:56:27', 3),
(22, 14, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Mahe Alif_test-1-1760470928749-96804274.pdf', '2025-10-15 01:42:08', 55, 'Needs more attention', '2025-10-15 01:43:14', 3),
(23, 16, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Final term Question Bank (1)-1760471598556-335130722.pdf', '2025-10-15 01:53:18', 80, 'Good job', '2025-10-15 01:55:13', 3),
(24, 19, 32, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Mahe Alif_test-1-1760638808191-311450421.pdf', '2025-10-17 00:20:08', 9, 'Very good', '2025-10-17 01:18:17', 3),
(25, 19, 33, 'C:\\Users\\mahee\\Documents\\Project\\elms\\uploads\\submissions\\Equilibrium Under Monopoly-1760632601148-464913508-1760638969005-695141580.pdf', '2025-10-17 00:22:49', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `university_events`
--

CREATE TABLE `university_events` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('holiday','exam_week','registration','orientation','graduation','maintenance','event') NOT NULL,
  `priority` enum('low','normal','high') DEFAULT 'normal',
  `created_by` bigint(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `university_events`
--

INSERT INTO `university_events` (`id`, `title`, `description`, `date`, `type`, `priority`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Fall Semester Registration', 'Online registration opens for Fall 2025 semester. Students must complete course selection by the deadline.', '2025-08-15', 'registration', 'high', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(2, 'Mid-term Exam Week', 'Mid-term examinations for all courses. No regular classes scheduled during this period.', '2025-10-14', 'exam_week', 'high', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(3, 'Independence Day Holiday', 'University closed in observance of Independence Day. All classes and offices closed.', '2025-03-26', 'holiday', 'normal', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(4, 'New Student Orientation', 'Mandatory orientation session for all newly admitted students. Campus tour and academic guidelines.', '2025-09-01', 'orientation', 'high', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(5, 'System Maintenance', 'Scheduled maintenance of university IT systems. Online services may be temporarily unavailable.', '2025-11-15', 'maintenance', 'normal', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(6, 'Annual Sports Day', 'University-wide sports competition and cultural activities. All students and faculty invited.', '2025-12-10', 'event', 'normal', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(7, 'Final Exam Period', 'Final examinations for Fall 2025 semester. Students must check exam schedules on the portal.', '2025-12-15', 'exam_week', 'high', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28'),
(8, 'Winter Break Begins', 'Winter vacation starts. University closed until next semester.', '2025-12-25', 'holiday', 'normal', 1, '2025-10-14 22:58:28', '2025-10-14 22:58:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(130) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Aminul Islam', 'admin.aminul@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'admin', 'https://i.pravatar.cc/150?img=1', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(2, 'Prof. Rashida Khatun', 'admin.rashida@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'admin', 'https://i.pravatar.cc/150?img=2', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(3, 'Dr. Sarah Johnson', 'sarah.johnson@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=3', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(4, 'Prof. Michael Chen', 'michael.chen@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=4', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(5, 'Dr. Emily Rodriguez', 'emily.rodriguez@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=5', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(6, 'Prof. David Kim', 'david.kim@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=6', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(7, 'Dr. Fatima Rahman', 'fatima.rahman@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=7', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(8, 'Prof. Ahmed Hassan', 'ahmed.hassan@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', 'https://i.pravatar.cc/150?img=8', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(9, 'Sakib Islam', 'sakib221131@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=9', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(10, 'Fatima Akter', 'fatima221132@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=10', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(11, 'Ariful Haque', 'ariful221133@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=11', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(12, 'Nusrat Jahan', 'nusrat221134@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=12', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(13, 'Rafiqul Islam', 'rafiqul221135@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=13', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(14, 'Taslima Khatun', 'taslima221136@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=14', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(15, 'Mohammad Ali', 'mohammad221137@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=15', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(16, 'Rashida Begum', 'rashida221138@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=16', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(17, 'Aminul Islam', 'aminul221139@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=17', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(18, 'Salma Akter', 'salma221140@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=18', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(19, 'Karim Rahman', 'karim221141@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=19', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(20, 'Nasreen Sultana', 'nasreen221142@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=20', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(21, 'Jahangir Alam', 'jahangir221143@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=21', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(22, 'Rubina Yasmin', 'rubina221144@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=22', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(23, 'Shahin Ahmed', 'shahin221145@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=23', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(24, 'Rokeya Khatun', 'rokeya221146@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=24', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(25, 'Habibur Rahman', 'habibur221147@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=25', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(26, 'Sultana Rajia', 'sultana221148@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=26', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(27, 'Abdullah Al Mamun', 'abdullah221149@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=27', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(28, 'Marium Akter', 'marium221150@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', 'https://i.pravatar.cc/150?img=28', '2025-09-30 19:01:16', '2025-10-13 20:46:12'),
(29, 'Test User', 'test@student.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-01 11:16:11', '2025-10-13 20:46:12'),
(30, 'Debug User', 'debug-test@student.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-01 11:46:02', '2025-10-13 20:46:12'),
(31, 'Golam Rabbani', 'golam.rabbani@uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'teacher', NULL, '2025-10-13 19:27:47', '2025-10-13 20:46:12'),
(32, 'Mahe Alif', 'mahe221130@bscse.uiu.ac.bd', '$2b$10$LN1AcBRw8bldUnqrZmS9y.sGevzTOeAxB7gkt6635hkrrFwDQJU5C', 'student', NULL, '2025-10-13 19:29:20', '2025-10-13 20:46:12'),
(33, 'Mark Protik', 'mark221129@bscse.uiu.ac.bd', '$2b$10$kBmyIIP85k/Fk13LncEkl.DA97hmC.1z8L9/kYyyMzG2SxEqYl3Pa', 'student', NULL, '2025-10-16 21:02:23', '2025-10-16 21:02:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_interactions`
--
ALTER TABLE `ai_interactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `ai_user_context`
--
ALTER TABLE `ai_user_context`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`),
  ADD KEY `idx_calendar_events_date` (`date`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_code` (`course_code`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `idx_course_code` (`course_code`),
  ADD KEY `idx_semester_year` (`semester`,`academic_year`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_course` (`user_id`,`course_id`),
  ADD UNIQUE KEY `unique_user_section` (`user_id`,`section_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `idx_section_user` (`section_id`,`user_id`);

--
-- Indexes for table `materials`
--
ALTER TABLE `materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `section_id` (`section_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `idx_teacher_id` (`teacher_id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `graded_by` (`graded_by`);

--
-- Indexes for table `university_events`
--
ALTER TABLE `university_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_university_events_date` (`date`),
  ADD KEY `idx_university_events_type` (`type`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_interactions`
--
ALTER TABLE `ai_interactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `ai_user_context`
--
ALTER TABLE `ai_user_context`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `materials`
--
ALTER TABLE `materials`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `university_events`
--
ALTER TABLE `university_events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_interactions`
--
ALTER TABLE `ai_interactions`
  ADD CONSTRAINT `ai_interactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ai_user_context`
--
ALTER TABLE `ai_user_context`
  ADD CONSTRAINT `ai_user_context_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD CONSTRAINT `chat_rooms_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `materials`
--
ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `fk_sections_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`graded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `university_events`
--
ALTER TABLE `university_events`
  ADD CONSTRAINT `university_events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
