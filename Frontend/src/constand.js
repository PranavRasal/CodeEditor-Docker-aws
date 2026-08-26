export const languages = {
    "javascript" : "18.15.0",
    "python" : "3.12.4",
    "java" : "15.0.2",
    "cpp" : "11.3.0"
}

// Judge0 language IDs (GET /api/languages lists all available)
export const judge0LanguageIds = {
    javascript: 63, // Node.js
    python: 71,
    java: 62,
    cpp: 54,
}

export const snippets = {
  javascript: `console.log("Hello World");`,

  python: `print("Hello World")`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,

  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}`,


};