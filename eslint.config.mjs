// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const tsconfigRoot = ""+import.meta.dirname // parser en string

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	tseslint.configs.recommendedTypeChecked,{
		languageOptions: {
			parserOptions: {
				projectService: { 
					allowDefaultProject: [ 
						"eslint.config.mjs",
						"babel.config.js",
						"jest.config.ts"
					],
					defaultProject: "tsconfig.json"
				 },
				project: "tsconfig.json",
				tsconfigRootDir: tsconfigRoot,
				projectFolderIgnoreList: ["**dist**"],
				sourceType: "module"
			},
		},
	}
) 