module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      watchSASS: {
        files: ['sass/**/*.sass', '!sass/tpl-specific/**/*.sass'],
        tasks: ['sass:main'],
      },
      watchSpecificSASS: {
        files: ['sass/tpl-specific/**/*.sass'],
        tasks: ['sass:specific'],
      },
      watchMainJS: {
        files: ['js/*.js', '!js/tpl-specific/**/*.js'],
        tasks: ['concat:concat_JS'],
      },
      watchOtherJS: {
        files: ['js/tpl-specific/**/*.js'],
        tasks: ['concat:concat_COPY'],
      },
      watchCSS: {
        files: ['../assets/css/main.css'],
        tasks: ['postcss', 'concat:concat_CSS'],
        options: {
          debounceDelay: 5000,
        },
      },
    },
    sass: {
      main: {
        options: {             // Target options
          style: 'expanded',   // options: nested, compact, compressed, expanded
          sourcemap: 'none',   // options: auto, file, inline, none
        },
        files: {               // Dictionary of files
          '../assets/css/main.css': 'sass/import.sass',  // 'destination': 'source'
        },
      },
      specific: {
        options: {               // Target options
          style: 'expanded',     // options: nested, compact, compressed, expanded
          sourcemap: 'none',     // options: auto, file, inline, none
        },
        files: [{                 // Dictionary of files
          expand: true,
          cwd: 'sass/tpl-specific/', // Parent directory
          src: '**/*.sass',
          ext: '.css',
          dest: '../assets/css/',
        }],
      },
    },
    concat: {
      concat_JS: {
        files: {
          '../assets/js/main.js': ['js/*.js'],
        },
      },
      concat_COPY: {
        files: [{
          expand: true,
          cwd: 'js/tpl-specific/', // Parent directory
          src: '*.js',
          ext: '.js',
          dest: '../assets/js/',
        }],
      },
      concat_CSS: { // for appending comments to the start of a file
        options: {
          separator: '\n\n',
        },
        files: {
          '../assets/css/main.css': ['sass/comment-header.css', '../assets/css/main.css'],
        },
      },
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({browsers: ['last 20 versions']}),
          //require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '../assets/css/*.css'
      }
    },
    'ftp-deploy' : {
      build: {
        auth: {
          host: 'ftp.hostname.cz',
          port: 21,
          authKey: 'key1'
        },
        src: ['./'],
        dest: './',
        exclusions: ['development/**/*', '.gitignore']
      }
    }
  });

  //looks for your grunt.initConfig object
  // watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  // compile Sass to CSS
  grunt.loadNpmTasks('grunt-contrib-sass');
  // concat
  grunt.loadNpmTasks('grunt-contrib-concat');
  // enable CSS prefixing
  grunt.loadNpmTasks('grunt-postcss');
  // enable FTP deploy
  grunt.loadNpmTasks('grunt-ftp-deploy');
  // set default
  grunt.registerTask('default', ['sass', 'concat', 'watch', 'postcss']);
  grunt.registerTask('prefix', ['postcss']);
  grunt.registerTask('ftp', ['ftp-deploy']);

};
