const { describe, it, after } = require('node:test');
const assert = require('node:assert');
const aiService = require('../services/aiService');
const geminiConfig = require('../config/gemini');
const aiController = require('../controllers/aiController');

describe('AI Career Roadmap Generator Verification', () => {
  after(() => {
    geminiConfig.setModelWrapper(null);
  });

  it('generateRoadmap succeeds when currentSkills is passed as a string', async () => {
    const mockRoadmap = {
      title: 'Roadmap to Full-Stack Developer',
      estimatedMonths: 6,
      phases: [
        {
          name: 'Core Frontend',
          description: 'Master React & modern JavaScript',
          topics: ['React Hooks', 'State Management', 'TypeScript']
        }
      ]
    };

    geminiConfig.setModelWrapper({
      generateContent: async (prompt) => {
        assert.ok(prompt.includes('React, Node.js'), 'Prompt should include passed skills string');
        return {
          response: {
            text: () => JSON.stringify(mockRoadmap)
          }
        };
      }
    });

    const result = await aiService.generateRoadmap('React, Node.js', 'Full-Stack Developer');
    assert.strictEqual(result.title, mockRoadmap.title);
    assert.strictEqual(result.phases.length, 1);
  });

  it('generateRoadmap succeeds when currentSkills is passed as an array', async () => {
    const mockRoadmap = {
      title: 'Roadmap to Backend Developer',
      estimatedMonths: 4,
      phases: [
        {
          name: 'Databases & APIs',
          description: 'Postgres & Express',
          topics: ['SQL', 'REST', 'Authentication']
        }
      ]
    };

    geminiConfig.setModelWrapper({
      generateContent: async (prompt) => {
        assert.ok(prompt.includes('Python, Django'), 'Prompt should include passed skills from array');
        return {
          response: {
            text: () => '```json\n' + JSON.stringify(mockRoadmap) + '\n```'
          }
        };
      }
    });

    const result = await aiService.generateRoadmap(['Python', 'Django'], 'Backend Developer');
    assert.strictEqual(result.title, mockRoadmap.title);
    assert.strictEqual(result.estimatedMonths, 4);
  });

  it('aiController.generateRoadmap validates input and returns roadmap', async () => {
    const mockRoadmap = {
      title: 'Roadmap to DevOps Engineer',
      estimatedMonths: 5,
      phases: []
    };

    geminiConfig.setModelWrapper({
      generateContent: async () => ({
        response: { text: () => JSON.stringify(mockRoadmap) }
      })
    });

    let sentResponse = null;
    const req = {
      body: {
        currentSkills: ['Docker', 'Linux'],
        targetRole: 'DevOps Engineer'
      }
    };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(data) { sentResponse = data; return this; }
    };

    await aiController.generateRoadmap(req, res, (err) => {
      assert.fail(`Should not call next with error: ${err?.message}`);
    });

    assert.ok(sentResponse.success);
    assert.strictEqual(sentResponse.data.roadmap.title, 'Roadmap to DevOps Engineer');
  });

  it('aiController.generateRoadmap rejects empty skills with 400', async () => {
    let sentResponse = null;
    const req = {
      body: {
        currentSkills: ['  ', ''],
        targetRole: 'DevOps Engineer'
      }
    };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(data) { sentResponse = data; return this; }
    };

    await aiController.generateRoadmap(req, res, () => {});
    assert.strictEqual(res.statusCode, 400);
    assert.ok(sentResponse.error.includes('valid current skill'));
  });
});
