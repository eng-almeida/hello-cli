import { RuleType, createNoctuaEngine } from '../../../../src/lib/core/rules-engine';

// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

describe('rules engine', () => {
  describe('when there are no rules', () => {
    it('should return no campaign', async () => {
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[]
        },
      ]
      const engine = createNoctuaEngine(rulesMock)
      const { events } = await engine.run({
        paths: ['src/lib/api.ts'],
        languages: ['typescript'],
        content: [
          "+let hello: string;",
        ],
      })
      assert.equal(events.length, 0);
    })
  });

  describe('when there are no matches', () => {
    it('should pick no campaign', async () => {
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[
            [
              {
                type: "matchcontent" as RuleType,
                value: "ApiClient"
              },
            ],
          ]
        },
      ]
      const engine = createNoctuaEngine(rulesMock)
      const { events } = await engine.run({ 
        paths: ["api/client.config.js"], 
        languages: ["javascript"], 
        content: "+let hello: string;" 
      })
      assert.equal(events.length, 0);
    });
  })

  describe('when there is one rule per campaign', () => {
    it('should pick the campaign id when there is a match', async () => {
      /**
       * campaign-1 targets:
       * - TS files within /src folder
       * 
       * campaign-2 targets:
       * - changed Typescript files
       */
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[
            [
              {
                type: "matchpath" as RuleType,
                value: "src/**/*.ts"
              }
            ]
          ]
        },
        {
          id: "campaign-2",
          rules:[
            [
              {
                type: "programming_language" as RuleType,
                value: "typescript"
              }
            ]
          ]
        }
      ]
      const engine = createNoctuaEngine(rulesMock)
      const { events } = await engine.run({
        paths: ['package.json','src/lib/api.ts'],
        languages: ['typescript'],
        content: "+let hello: string;" 
      })
      assert.equal(events.length, 2);
      assert.deepStrictEqual(events, [
        { type: 'rulesValidation', params: { campaignId: 'campaign-1' } },
        { type: 'rulesValidation', params: { campaignId: 'campaign-2' } }
      ]);
    })
  });

  describe('when there are multiple OR rules per campaign', () => {
    it('should pick the campaign id when there is a match', async () => {
      /**
       * campaign-1 targets:
       * - TS files within /src OR /config folder
       * 
       * campaign-2 targets:
       * - changed Typescript files OR tsconfig.json
       */
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[
            [
              {
                type: "matchpath" as RuleType,
                value: "src/**/*.ts"
              },
              {
                type: "matchpath" as RuleType,
                value: "config/**/*.ts"
              }
            ],
          ]
        },
        {
          id: "campaign-2",
          rules:[
            [
              {
                type: "matchpath" as RuleType,
                value: "tsconfig.json"
              },
              {
                type: "programming_language" as RuleType,
                value: "typescript"
              },
            ]
          ]
        }
      ]
      const engine = createNoctuaEngine(rulesMock);
      const { events } = await engine.run({
        paths: ['package.json','src/lib/api.ts'],
        languages: ['typescript'],
        content: [
          ' {\n   "name": "action",\n-  "version": "1.0.1",\n+  "version": "1.0.2",\n   "description": "",\n   "main": "index.js",\n   "scripts": {',
          "+let hello: string;",
        ],
      });
      assert.equal(events.length, 2);
      assert.deepStrictEqual(
        events, 
        [
          { type: 'rulesValidation', params: { campaignId: 'campaign-1' } },
          { type: 'rulesValidation', params: { campaignId: 'campaign-2' } }
        ]
      );

      const { events: tsconfigEvent } = await engine.run({
        paths: ['tsconfig.json'],
        languages: ['typescript'],
        content: [
          '-  "outDir": "dist",\n+  "outDir": "build"',
        ],
      });
      assert.equal(tsconfigEvent.length, 1);
      assert.deepStrictEqual(
        tsconfigEvent, 
        [
          { type: 'rulesValidation', params: { campaignId: 'campaign-2' } }
        ]
      );
    });
  });

  describe('when there are multiple AND rules per campaign', () => {
    it('should pick the campaign id when there is a match', async () => {
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[
            [
              {
                type: "matchpath" as RuleType,
                value: "src/**/*"
              }
            ],
            [
              {
                type: "programming_language" as RuleType,
                value: "typescript"
              }
            ]
          ]
        }
      ]
      const engine = createNoctuaEngine(rulesMock)
      const { events } = await engine.run({
        paths: ['src/lib/api.ts'],
        languages: ['typescript'],
        content: [
          "+let hello: string;",
        ],
      })
      assert.equal(events.length, 1);
      assert.deepStrictEqual(events[0], { type: 'rulesValidation', params: { campaignId: 'campaign-1' } });
    });
    it('should pick no campaign id when there is no match', async () => {
      /**
       * campaign-1 targets:
       * files within /src folder AND TS files are changed
       */
      const rulesMock = [
        {
          id: "campaign-1",
          rules:[
            [
              {
                type: "matchpath" as RuleType,
                value: "src/**/*"
              }
            ],
            [
              {
                type: "programming_language" as RuleType,
                value: "typescript"
              }
            ]
          ]
        }
      ]
      const engine = createNoctuaEngine(rulesMock)
      const { events } = await engine.run({ 
        paths: ['package.json'],
        languages: ['typescript'],
        content: [
          ' {\n   "name": "action",\n-  "version": "1.0.1",\n+  "version": "1.0.2",\n   "description": "",\n   "main": "index.js",\n   "scripts": {',
          "+let hello: string;",
        ]
      })
      assert.equal(events.length, 0);
    });
  })

  describe('when there are multiple AND/OR rules per campaign', () => {
    /**
     * Targeting:
     * files within /src OR /api folder AND changes in TS file
     */
    const rulesMock = [
      {
        id: "campaign-1",
        rules:[
          [
            {
              type: "matchpath" as RuleType,
              value: "src/**/*"
            },
            {
              type: "matchpath" as RuleType,
              value: "api/**/*"
            },
          ],
          [
            {
              type: "programming_language" as RuleType,
              value: "typescript"
            }
          ]
        ]
      }
    ];

    it('should pick the campaign id when there is a match', async () => {
      const engine = createNoctuaEngine(rulesMock)
      // button.tsx is inside of /src folder AND is a TS file
      const { events: srcEvents } = await engine.run({
        paths: ['src/component/button.tsx'], 
        languages: ['typescript']
      })
      assert.equal(srcEvents.length, 1);
      assert.deepStrictEqual(srcEvents[0], { type: 'rulesValidation', params: { campaignId: 'campaign-1' } });

      // index.ts is inside of /api folder AND is a TS file
      const { events } = await engine.run({ 
        paths: ['api/index.ts'], 
        languages: ['typescript']
      })
      assert.equal(events.length, 1);
      assert.deepStrictEqual(events[0], { type: 'rulesValidation', params: { campaignId: 'campaign-1' } });

      
    });

    it('should pick no campaign id when there is no match', async () => {
      const engine = createNoctuaEngine(rulesMock)
      // button.jsx is inside of /src folder BUT it's not TS file
      const { events: noEvents } = await engine.run({
        paths: ['src/component/button.jsx'], 
        languages: ['javascript']
      })
      assert.equal(noEvents.length, 0);
    })
  })
})