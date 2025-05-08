"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ProgressContext } from "../contexts/ProgressContext"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"
import "./LessonPage.css"

const LessonPage = () => {
  const { topicId } = useParams()
  const { completeLesson } = useContext(ProgressContext)
  const [topic, setTopic] = useState(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // In a real app, fetch topic and lessons from the backend
    // For now, we'll use mock data
    const mockTopics = {
      "java-basics": {
        id: "java-basics",
        title: "Java Basics",
        description: "Learn the fundamentals of Java programming",
        icon: "☕",
        lessons: [
          {
            id: "java-basics-1",
            title: "Introduction to Java",
            content: `
              <h2>What is Java?</h2>
              <p>Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.</p>
              <p>It is a general-purpose programming language intended to let application developers write once, run anywhere (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation.</p>
              
              <h2>Key Features of Java</h2>
              <ul>
                <li><strong>Platform Independence:</strong> Java code runs on any device that has the Java Virtual Machine (JVM) installed.</li>
                <li><strong>Object-Oriented:</strong> Java is based on the concept of objects, which contain data and methods.</li>
                <li><strong>Simple:</strong> Java was designed to be easy to learn and use.</li>
                <li><strong>Secure:</strong> Java has built-in security features.</li>
                <li><strong>Robust:</strong> Java emphasizes early checking for possible errors and runtime checking.</li>
              </ul>
            `,
          },
          {
            id: "java-basics-2",
            title: "Variables and Data Types",
            content: `
              <h2>Variables in Java</h2>
              <p>A variable is a container that holds values that are used in a Java program. Every variable must be declared with a specific data type.</p>
              
              <h2>Primitive Data Types</h2>
              <ul>
                <li><strong>byte:</strong> 8-bit integer (-128 to 127)</li>
                <li><strong>short:</strong> 16-bit integer (-32,768 to 32,767)</li>
                <li><strong>int:</strong> 32-bit integer (-2^31 to 2^31-1)</li>
                <li><strong>long:</strong> 64-bit integer (-2^63 to 2^63-1)</li>
                <li><strong>float:</strong> 32-bit floating point</li>
                <li><strong>double:</strong> 64-bit floating point</li>
                <li><strong>boolean:</strong> true or false</li>
                <li><strong>char:</strong> 16-bit Unicode character</li>
              </ul>
              
              <h2>Example</h2>
              <pre>
              int age = 25;
              double salary = 50000.50;
              char grade = 'A';
              boolean isActive = true;
              </pre>
            `,
          },
          {
            id: "java-basics-3",
            title: "Control Flow",
            content: `
              <h2>Control Flow Statements</h2>
              <p>Control flow statements allow you to control the flow of execution in your program based on certain conditions.</p>
              
              <h2>If-Else Statement</h2>
              <pre>
              if (condition) {
                  // code to execute if condition is true
              } else {
                  // code to execute if condition is false
              }
              </pre>
              
              <h2>Switch Statement</h2>
              <pre>
              switch (expression) {
                  case value1:
                      // code
                      break;
                  case value2:
                      // code
                      break;
                  default:
                      // default code
              }
              </pre>
              
              <h2>Loops</h2>
              <p><strong>For Loop:</strong></p>
              <pre>
              for (initialization; condition; update) {
                  // code to repeat
              }
              </pre>
              
              <p><strong>While Loop:</strong></p>
              <pre>
              while (condition) {
                  // code to repeat
              }
              </pre>
              
              <p><strong>Do-While Loop:</strong></p>
              <pre>
              do {
                  // code to repeat
              } while (condition);
              </pre>
            `,
          },
          {
            id: "java-basics-4",
            title: "Arrays",
            content: `
              <h2>Arrays in Java</h2>
              <p>An array is a container object that holds a fixed number of values of a single type.</p>
              
              <h2>Declaring Arrays</h2>
              <pre>
              // Declaration
              int[] numbers;
              
              // Initialization
              numbers = new int[5]; // Creates an array of 5 integers
              
              // Declaration and initialization
              int[] scores = {90, 85, 78, 92, 88};
              </pre>
              
              <h2>Accessing Array Elements</h2>
              <pre>
              int firstScore = scores[0]; // Access the first element (index 0)
              scores[2] = 95; // Modify the third element (index 2)
              </pre>
              
              <h2>Array Length</h2>
              <pre>
              int length = scores.length; // Get the length of the array
              </pre>
              
              <h2>Iterating Through Arrays</h2>
              <pre>
              // Using for loop
              for (int i = 0; i < scores.length; i++) {
                  System.out.println(scores[i]);
              }
              
              // Using enhanced for loop (for-each)
              for (int score : scores) {
                  System.out.println(score);
              }
              </pre>
            `,
          },
          {
            id: "java-basics-5",
            title: "Methods",
            content: `
              <h2>Methods in Java</h2>
              <p>A method is a block of code that performs a specific task. Methods are used to achieve code reusability and modularity.</p>
              
              <h2>Method Declaration</h2>
              <pre>
              returnType methodName(parameterList) {
                  // method body
                  return value; // if return type is not void
              }
              </pre>
              
              <h2>Example Methods</h2>
              <pre>
              // Method with no parameters and no return value
              void sayHello() {
                  System.out.println("Hello!");
              }
              
              // Method with parameters and return value
              int add(int a, int b) {
                  return a + b;
              }
              
              // Method with parameters and no return value
              void displayInfo(String name, int age) {
                  System.out.println("Name: " + name + ", Age: " + age);
              }
              </pre>
              
              <h2>Method Overloading</h2>
              <p>Method overloading allows different methods to have the same name but different parameters.</p>
              <pre>
              int add(int a, int b) {
                  return a + b;
              }
              
              double add(double a, double b) {
                  return a + b;
              }
              
              int add(int a, int b, int c) {
                  return a + b + c;
              }
              </pre>
            `,
          },
        ],
      },
    }

    const selectedTopic = mockTopics[topicId]
    if (selectedTopic) {
      setTopic(selectedTopic)
    }

    setLoading(false)
  }, [topicId])

  const handleNextLesson = () => {
    if (currentLessonIndex < topic.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
      window.scrollTo(0, 0)
    } else {
      // Complete the topic
      completeLesson(topicId)
      navigate("/dashboard")
    }
  }

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!topic) {
    return (
      <div className="lesson-container">
        <Navbar />
        <div className="lesson-content">
          <h1>Topic not found</h1>
          <button className="lesson-button" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const currentLesson = topic.lessons[currentLessonIndex]
  const isLastLesson = currentLessonIndex === topic.lessons.length - 1

  return (
    <div className="lesson-container">
      <Navbar />

      <div className="lesson-header">
        <h1>{topic.title}</h1>
        <div className="lesson-progress">
          <div className="progress-text">
            Lesson {currentLessonIndex + 1} of {topic.lessons.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentLessonIndex + 1) / topic.lessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="lesson-content">
        <h2>{currentLesson.title}</h2>
        <div className="lesson-text" dangerouslySetInnerHTML={{ __html: currentLesson.content }}></div>

        <div className="lesson-navigation">
          <button
            className="lesson-button secondary"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
          >
            Previous
          </button>

          <button className="lesson-button primary" onClick={handleNextLesson}>
            {isLastLesson ? "Complete Topic" : "Next Lesson"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LessonPage
