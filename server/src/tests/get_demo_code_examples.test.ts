import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { codeExamplesTable } from '../db/schema';
import { type CreateCodeExampleInput } from '../schema';
import { getDemoCodeExamples } from '../handlers/get_demo_code_examples';

// Test data for demo code examples
const nodejsDemoExample: CreateCodeExampleInput = {
  course_id: null,
  title: 'Express Server Demo',
  description: 'A simple Express.js server example',
  language: 'nodejs',
  code_content: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello World!" });\n});\n\napp.listen(3000);',
  expected_output: '{"message": "Hello World!"}',
  is_demo: true,
  difficulty_level: 'beginner'
};

const pythonDemoExample: CreateCodeExampleInput = {
  course_id: null,
  title: 'Flask API Demo',
  description: 'A simple Flask API example',
  language: 'python',
  code_content: 'from flask import Flask, jsonify\n\napp = Flask(__name__)\n\n@app.route("/")\ndef hello():\n    return jsonify({"message": "Hello from Python!"})\n\nif __name__ == "__main__":\n    app.run(debug=True)',
  expected_output: '{"message": "Hello from Python!"}',
  is_demo: true,
  difficulty_level: 'beginner'
};

const csharpDemoExample: CreateCodeExampleInput = {
  course_id: null,
  title: 'ASP.NET Core Demo',
  description: 'A simple ASP.NET Core API example',
  language: 'csharp',
  code_content: 'using Microsoft.AspNetCore.Mvc;\n\n[ApiController]\n[Route("[controller]")]\npublic class HelloController : ControllerBase\n{\n    [HttpGet]\n    public IActionResult Get()\n    {\n        return Ok(new { message = "Hello from C#!" });\n    }\n}',
  expected_output: '{"message": "Hello from C#!"}',
  is_demo: true,
  difficulty_level: 'intermediate'
};

const nonDemoExample: CreateCodeExampleInput = {
  course_id: null,
  title: 'Regular Course Example',
  description: 'Not a demo example',
  language: 'nodejs',
  code_content: 'console.log("Not for demo");',
  expected_output: 'Not for demo',
  is_demo: false,
  difficulty_level: 'beginner'
};

describe('getDemoCodeExamples', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no demo examples exist', async () => {
    const result = await getDemoCodeExamples();
    
    expect(result).toEqual([]);
  });

  it('should return only demo code examples', async () => {
    // Create both demo and non-demo examples
    await db.insert(codeExamplesTable)
      .values([
        {
          ...nodejsDemoExample,
          is_demo: nodejsDemoExample.is_demo
        },
        {
          ...nonDemoExample,
          is_demo: nonDemoExample.is_demo
        }
      ])
      .execute();

    const results = await getDemoCodeExamples();

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Express Server Demo');
    expect(results[0].is_demo).toBe(true);
    expect(results[0].language).toEqual('nodejs');
  });

  it('should return demo examples from all languages', async () => {
    // Create demo examples for all supported languages
    await db.insert(codeExamplesTable)
      .values([
        {
          ...nodejsDemoExample,
          is_demo: nodejsDemoExample.is_demo
        },
        {
          ...pythonDemoExample,
          is_demo: pythonDemoExample.is_demo
        },
        {
          ...csharpDemoExample,
          is_demo: csharpDemoExample.is_demo
        }
      ])
      .execute();

    const results = await getDemoCodeExamples();

    expect(results).toHaveLength(3);
    
    const languages = results.map(r => r.language).sort();
    expect(languages).toEqual(['csharp', 'nodejs', 'python']);
    
    // All should be demo examples
    results.forEach(result => {
      expect(result.is_demo).toBe(true);
    });
  });

  it('should return examples ordered by created_at descending', async () => {
    // Insert examples with slight delay to ensure different timestamps
    await db.insert(codeExamplesTable)
      .values({
        ...nodejsDemoExample,
        is_demo: nodejsDemoExample.is_demo
      })
      .execute();
    
    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(codeExamplesTable)
      .values({
        ...pythonDemoExample,
        is_demo: pythonDemoExample.is_demo
      })
      .execute();

    const results = await getDemoCodeExamples();

    expect(results).toHaveLength(2);
    // Most recent (Python) should be first
    expect(results[0].title).toEqual('Flask API Demo');
    expect(results[1].title).toEqual('Express Server Demo');
    
    // Verify descending order
    expect(results[0].created_at >= results[1].created_at).toBe(true);
  });

  it('should return code examples with proper field types', async () => {
    await db.insert(codeExamplesTable)
      .values({
        ...nodejsDemoExample,
        is_demo: nodejsDemoExample.is_demo
      })
      .execute();

    const results = await getDemoCodeExamples();
    const example = results[0];

    // Verify all required fields are present
    expect(example.id).toBeDefined();
    expect(typeof example.id).toBe('number');
    expect(example.course_id).toBeNull();
    expect(example.title).toEqual('Express Server Demo');
    expect(example.description).toEqual('A simple Express.js server example');
    expect(example.language).toEqual('nodejs');
    expect(example.code_content).toContain('express');
    expect(example.expected_output).toEqual('{"message": "Hello World!"}');
    expect(example.is_demo).toBe(true);
    expect(example.difficulty_level).toEqual('beginner');
    expect(example.created_at).toBeInstanceOf(Date);
    expect(example.updated_at).toBeInstanceOf(Date);
  });

  it('should handle examples with nullable fields correctly', async () => {
    const exampleWithNulls: CreateCodeExampleInput = {
      course_id: null,
      title: 'Minimal Demo',
      description: null,
      language: 'nodejs',
      code_content: 'console.log("test");',
      expected_output: null,
      is_demo: true,
      difficulty_level: 'beginner'
    };

    await db.insert(codeExamplesTable)
      .values({
        ...exampleWithNulls,
        is_demo: exampleWithNulls.is_demo
      })
      .execute();

    const results = await getDemoCodeExamples();
    const example = results[0];

    expect(example.title).toEqual('Minimal Demo');
    expect(example.description).toBeNull();
    expect(example.expected_output).toBeNull();
    expect(example.course_id).toBeNull();
    expect(example.is_demo).toBe(true);
  });

  it('should exclude non-demo examples even with same other properties', async () => {
    const demoExample = { ...nodejsDemoExample };
    const nonDemo = { ...nodejsDemoExample, title: 'Non-demo version', is_demo: false };

    await db.insert(codeExamplesTable)
      .values([
        {
          ...demoExample,
          is_demo: demoExample.is_demo
        },
        {
          ...nonDemo,
          is_demo: nonDemo.is_demo
        }
      ])
      .execute();

    const results = await getDemoCodeExamples();

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Express Server Demo');
    expect(results[0].is_demo).toBe(true);
  });
});