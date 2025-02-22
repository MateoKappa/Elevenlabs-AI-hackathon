export default function Page() {
  return (
    <article className="doc">
      <h1 className="text-3xl font-semibold mb-3">SohoPro</h1>
      <p className="text-muted-foreground">React (Next.js) Chat App Template</p>
      <hr />
      <h2 id="Introduction"># Introduction</h2>
      <p>
        This document is about how to install and use SohoPro. The information
        here includes basic installation and usage information.
      </p>
      <p>
        Next.js and Tailwind CSS were used to build SohoPro. To use and continue
        developing this application, knowledge of React, Javascript, Typescript
        is required.
      </p>
      <p>
        <b>Key Features</b>
      </p>
      <p>
        <ul className="list-disc ms-7">
          <li>Built with Next.js</li>
          <li>App router</li>
          <li>98% Typescript was used.</li>
          <li>Tailwind CSS used</li>
        </ul>
      </p>
      <h2 id="Development"># Development</h2>
      <p>
        Before developing SohoPro on your computer, you need to do some setup.
        First of all, you need a package manager.&nbsp;You may use&nbsp;
        <code>npm</code>&nbsp;or&nbsp;<code>yarn</code>&nbsp;to serve this
        purpose.
      </p>
      <p>
        <strong>Npm Installation:</strong>&nbsp;
        <a
          href="https://nodejs.org/en/download/"
          className="text-muted-foreground hover:underline"
          target="_blank"
        >
          https://nodejs.org/en/download/
        </a>
      </p>
      <p>
        <strong>Yarn Installation:</strong>&nbsp;
        <a
          href="https://yarnpkg.com/lang/en/docs/install/"
          className="text-muted-foreground hover:underline"
          target="_blank"
        >
          https://yarnpkg.com/lang/en/docs/install/
        </a>
      </p>
      <p>After installing the package manager, follow these steps.</p>
      <p>
        Please go to the project directory via command line and use one of the
        commands below.
      </p>
      <p>
        <pre>
          <code>cd sohopro</code>
        </pre>
      </p>
      <p>
        <code>npm install</code>&nbsp;or&nbsp;<code>yarn install</code>
      </p>
      <p>
        <b>Starting the Project</b>
      </p>
      <p>Use the commands below to start the project.</p>
      <p>
        <code>npm run dev</code>&nbsp;or&nbsp;<code>yarn run dev</code>
      </p>
      <p>
        This command runs the application in development mode and opens a new
        tab in the browser to view the project. If you make changes to the code,
        the page will reload automatically. You can see compilation errors and
        warnings on the console.
      </p>
      <h2 id="Production"># Production</h2>
      <p>
        <b>Creating a Production Build</b>
      </p>
      <p>
        <code>npm run build</code>&nbsp;creates a&nbsp;<code>/.next</code>
        <dialog></dialog>irectory with a production build of your app. Inside
        the directory will be your JavaScript and CSS files.
      </p>
      <h2 id="FileStructure">File Structure</h2>
      <p>
        {" "}
        The file structure is the standard Next.js folder structure which is not
        very complex.
      </p>
      <figure>
        <img
          src="/images/file-structure.png"
          className="rounded-lg"
          alt="file structure"
        />
      </figure>
      <h2 id="ThemeCustomization"># Theme Customization</h2>
      <p>
        It is very simple to customize the SohoPro design. If you want to make
        design changes, you can use scss files. Follow this path to access these
        files.
      </p>
      <p>
        <b>/app/global.css</b>
      </p>
      <pre>
        <code>
          {`--background: 0 0% 100%;
--foreground: 20 14.3% 4.1%;
--card: 0 0% 100%;
--card-foreground: 20 14.3% 4.1%;
--popover: 0 0% 100%;
--popover-foreground: 20 14.3% 4.1%;
--primary: 150.01deg 38.85% 47.64%;
--primary-foreground: 60 9.1% 97.8%;
--secondary: 60 4.8% 95.9%;
--secondary-foreground: 24 9.8% 10%;
--muted: 60 4.8% 95.9%;
--muted-foreground: 25 5.3% 44.7%;
--accent: 60 4.8% 95.9%;
--accent-foreground: 24 9.8% 10%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 60 9.1% 97.8%;
--border: 20 5.9% 90%;
--input: 20 5.9% 90%;
--ring: 20 14.3% 4.1%;
--radius: 0.5rem;`}
        </code>
      </pre>
      <p>
        You can add your own variables for further customization. You need to
        define this separately in the <code>tailwind.config.ts</code> file.
      </p>
      <pre>
        <code>
          {`extend: {
  colors: {
    name: value,
  }
}`}
        </code>
      </pre>
      <h2 id="Support">Support</h2>
      <p>
        Please message me when you encounter any problems. I would be happy to
        assist you.
      </p>
      <p>
        <a
          className="text-muted-foreground hover:underline"
          href="mailto:support@laborasyon.com"
        >
          support@laborasyon.com
        </a>
      </p>
    </article>
  );
}
