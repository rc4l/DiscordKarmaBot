import { sh, cli } from 'tasksfile';

const p = () => {
	sh('rollup');
	sh('git add .');
	sh('npm version patch -git-tag-version false');

	const version = sh('npm version utilities --version');

	sh(`git commit -q -m ${version}`);
	sh('git push');
};

cli({
	p,
});