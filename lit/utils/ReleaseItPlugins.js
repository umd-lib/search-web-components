import {Plugin} from 'release-it';
import {readFileSync, writeFileSync} from 'fs';

class ReleaseItPlugins extends Plugin {
  // Update prerelease tags to remove the last dot between the prerelease type and version i.e -alpha.1 to -alpha1.
  // So that d.o considers it valid release tag. See https://www.drupal.org/project/drupalorg/issues/3135897 for why the dot is not valid on d.o.
  async beforeRelease() {
    const {version} = this.config.getContext();

    if (
      this.config.options.increment !== 'prerelease' ||
      !this.config.options.git.tag
    ) {
      return;
    }

    const lastDot = version.lastIndexOf('.');
    const drupalTag =
      version.substring(0, lastDot) + version.substring(lastDot + 1);

    this.config.setContext({tagName: drupalTag});
    this.config.setContext({version: drupalTag});
  }

  async bump() {
    // Major and minor releases have impacts on other versions so make sure everything is updated with the new prefix.
    if (
      this.config.options.increment === 'major' ||
      this.config.options.increment === 'minor'
    ) {
      const {version} = this.config.getContext();

      // Update all versions in version.json with the new major prefix. I.e. 2.0.0
      let data = JSON.parse(readFileSync('./version.json', 'utf8'));
      data.dev = `${version}-dev`;
      data.alpha = `${version}-alpha`;
      data.beta = `${version}-beta`;
      writeFileSync('./version.json', JSON.stringify(data, null, 2) + '\n');

      // Update the dev release script with the new __x npm tag.
      let config = JSON.parse(readFileSync('./package.json', 'utf8'));

      const lastDot = version.lastIndexOf('.');
      let devVersion = version.substring(0, lastDot) + 'x';
      devVersion = devVersion.replaceAll('.', '');

      config.scripts['release:dev'] = config.scripts['release:dev'].replace(
        /--npm.tag=[^\s]*/,
        `--npm.tag=${devVersion}`
      );
      writeFileSync('./package.json', JSON.stringify(config, null, 2) + '\n');
    }
  }
}

export default ReleaseItPlugins;
