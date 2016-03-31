'use strict';

module.exports = function(grunt) {

  //Load assemble
  grunt.loadNpmTasks('assemble');

  //Load Handlebars to JST File Compiler
  grunt.loadNpmTasks('grunt-contrib-handlebars');

  // show elapsed time at the end
  require('time-grunt')(grunt);

  

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // grunt config
  grunt.initConfig({

    // configurable paths
    configs: {
      app: 'app',
      dist: 'dist',
      prototype: 'prototype',
      tmp: '.tmp',
      jsinternal: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-internal',
      jsexternal: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-external',
      csscore: 'ui/src/main/content/jcr_root/etc/designs/mda/core-design/clientlib-internal',
      cssmdaweb: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/clientlib-internal',
      images: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/images',
      fonts: 'ui/src/main/content/jcr_root/etc/designs/mda/mda-web/fonts'
    },

    watch: {
      compass: {
        files: ['<%= configs.app %>/styles/**/*.scss'],
        tasks: ['compass:prototype', 'autoprefixer']
      },
      styles: {
        files: ['<%= configs.app %>/styles/**/{,*/}*.css'],
        tasks: ['autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= configs.app %>/templates/**/*.hbs',
          '<%= configs.app %>/templates/helpers/*.js',
          '<%= configs.app %>/templates/data/*.{json,yml}',
          '{<%= configs.tmp %>,<%= configs.app %>}/styles/{,*/}*.css',
          '{<%= configs.tmp %>,<%= configs.app %>}/scripts/{,*/}*.js',
          '{<%= configs.tmp %>,<%= configs.app %>}/scripts/{,*/}*.hbs',
          '<%= configs.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['handlebars','copy:protoScripts', 'assemble']
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          open: true,
          base: [
            '<%= configs.tmp %>',
            '<%= configs.app %>'
          ]
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= configs.prototype %>'
        }
      }
    },

    clean: {
      prototype: {
        files: [{
          dot: true,
          src: [
            '<%= configs.tmp %>',
            '<%= configs.prototype %>/*',
            '!<%= configs.prototype %>/.git*'
          ]
        }]
      },
      server: '<%= configs.tmp %>',
      scripts: '<%= configs.tmp %>/scripts/*'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= configs.app %>/scripts/{,*/}*.js',
        '!<%= configs.app %>/scripts/vendor/*'
      ]
    },

    compass: {
      core: {
        options: {
          require: ['susy','breakpoint'],
          sassDir: '<%= configs.app %>/styles',
          cssDir: '<%= configs.tmp %>/styles',
          // importPath: '<%= configs.app %>/bower_components',
          httpImagesPath: '<%= configs.images %>',
          httpFontsPath: '<%= configs.fonts %>',
          relativeAssets: false
        }
      },
      prototype: {
        options: {
          require: ['breakpoint'],
          sassDir: '<%= configs.app %>/styles',
          cssDir: '<%= configs.tmp %>/styles',
          // importPath: '<%= configs.app %>/bower_components',
          httpImagesPath: '<%= configs.images %>',
          httpFontsPath: '<%= configs.fonts %>',
          relativeAssets: false
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= configs.tmp %>/styles',
          src: '{,*/}*.css',
          dest: '<%= configs.tmp %>/styles'
        }]
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= configs.prototype %>'
      },
      html: '<%= configs.tmp %>/index.html'
    },

    usemin: {
      options: {
        dirs: ['<%= configs.prototype %>']
      },
      html: ['<%= configs.prototype %>/{,*/}*.html'],
      css: ['<%= configs.prototype %>/styles/{,*/}*.css']
    },

    modernizr: {
      devFile: '<%= configs.app %>/bower_components/modernizr/modernizr.js',
      outputFile: '<%= configs.jsexternal %>/modernizr/modernizr.js',
      uglify: true
    },

    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: false,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= configs.tmp %>',
          src: '*.html',
          dest: '<%= configs.prototype %>'
        }]
      },
      deploy: {
        options: {
          collapseWhitespace: false
        },
        files: [{
          expand: true,
          cwd: '<%= configs.prototype %>',
          src: '*.html',
          dest: '<%= configs.prototype %>'
        }]
      }
    },

    // Put files not handled in other tasks here
    copy: {
      ci: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>',
          dest: '<%= configs.prototype %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'mda-web/**'
          ]
        }]
      },
      scripts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>/scripts',
          dest: '<%= configs.jsinternal %>/js',
          src: '{,*/}*.js'
        }]
        //{
        //  expand: true,
        //  dot: true,
        //  cwd: '<%= configs.app %>',
        //  dest: '<%= configs.jsexternal %>',
        //  src: ['bower_components/{,*/}*']
        //}]
      },
      protoScripts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>/scripts',
          dest: '<%= configs.tmp %>/scripts/',
          src: '{,*/}*.js'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= configs.app %>',
          dest: '<%= configs.tmp %>',
          src: ['bower_components/**']
        }]
      },
      assets: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/concat/scripts',
          dest: '<%= configs.prototype %>/scripts',
          src: '**'
        },{
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/concat/templates',
          dest: '<%= configs.prototype %>/templates',
          src: '**'
        }, {
          expand: true,
          dot: true,
          cwd: '<%= configs.tmp %>/styles',
          dest: '<%= configs.prototype %>/styles',
          src: '**'
        }]
      },
      images: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/images',
        dest: '<%= configs.prototype %>/mda-web/images',
        src: '**'
      },
      fonts: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/fonts',
        dest: '<%= configs.prototype %>/mda-web/fonts',
        src: '**'
      },
      crossdomain: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/templates',
        dest: '<%= configs.tmp %>',
        src: 'crossdomain.xml'
      },
      mdaSkin: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/jwplayer',
        dest: '<%= configs.tmp %>',
        src: 'mdaSkin.xml'
      },
      crossdomainBuild: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/templates',
        dest: '<%= configs.prototype %>/site',
        src: 'crossdomain.xml'
      },
      mdaSkinBuild: {
        expand: true,
        dot: true,
        cwd: '<%= configs.app %>/mda-web/jwplayer',
        dest: '<%= configs.prototype %>/site',
        src: 'mdaSkin.xml'
      },
      htmldist: {
        expand: true,
        dot: true,
        cwd: '<%= configs.tmp %>',
        dest: '<%= configs.prototype %>',
        src: '*.html'
      }
    },

    concurrent: {
      server: [
        'compass'
      ]
    },

    assemble: {
      options: {
        flatten: true,
        layoutdir: '<%= configs.app %>/templates/layouts',
        layout: 'default.hbs',
        partials: ['<%= configs.app %>/templates/partials/**/*.hbs'],
        helpers: ['<%= configs.app %>/templates/helpers/*.js'],
        data: '<%= configs.app %>/templates/data/*.json'
      },
      pages: {
        files: {
          '<%= configs.tmp %>/': [
            '<%= configs.app %>/templates/pages/{,*/}*.hbs'
          ]
        }
      }
    },

    bower: {
      options: {
        exclude: ['modernizr']
      }
    },

    prettify: {
      options: {},
      app: {
        expand: true,
        cwd: '<%= configs.tmp %>',
        ext: '.html',
        src: ['{,*/}*.html'],
        dest: '<%= configs.tmp %>'
      },
      prototype: {
        expand: true,
        cwd: '<%= configs.prototype %>/cms',
        ext: '.html',
        src: ['{,*/}*.html'],
        dest: '<%= configs.prototype %>/cms'
      }
    },

    handlebars: {
      compile: {
        options: {
          namespace: "APP.Templates",
          processName: function(filePath) {
            return filePath.replace(/^assets\/scripts\/hbs\//, '').replace(/\.hbs$/, '').replace(/-/g,'_');
          }
        },
        files: {
          "<%= configs.app %>/scripts/app.handlebar-templates.js": "<%= configs.app %>/scripts/hbs/*.hbs"
        }
      }
    },

    replace: {
      images: {
        src: ['<%= configs.prototype %>/cms/**/*.html'],
        overwrite: true,
        replacements: [{
          from: 'mda-web/images/',
          to: '../../site/mda-web/images/'
        }]
      },
      fonts: {
        src: ['<%= configs.prototype %>/site/styles/app.styles.css'],
        overwrite: true,
        replacements: [{
          from: '../../../mda-web/fonts/',
          to: '../mda-web/fonts/'
        }]
      },
      local: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocal: false',
          to: 'isLocal: true'
        }]
      },
      localbuild: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocal: true',
          to: 'isLocal: false'
        }]
      },
      localImages: {
        src: ['<%= configs.prototype %>/site/scripts/app.scripts.js'],
        overwrite: true,
        replacements: [{
          from: 'isLocalImages: false',
          to: 'isLocalImages: true'
        }]
      }
    },

    autoshot: {
      default_options: {
        options: {
          // necessary config
          path: '<%= configs.tmp %>/screenshots',
          // optional config, must set either remote or local
          remote: {
            files: [
              { src: "http://0.0.0.0:9000/becoming-our-patient.html", dest: "becoming-our-patient.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/blog-post.html", dest: "blog-post.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/blog.html", dest: "blog.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/breast-cancer-treatment.html", dest: "breast-cancer-treatment.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/breast-cancer.html", dest: "breast-cancer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/care-center.html", dest: "care-center.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/caregiver.html", dest: "caregiver.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/donate-volunteer.html", dest: "donate-volunteer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/life-after-cancer.html", dest: "life-after-cancer.png", delay: 1000 },
              { src: "http://0.0.0.0:9000/patients-family.html", dest: "patients-family.png", delay: 1000 }
            ]
          },
          viewport: ['375x600', '768x800', '1440x1080']
        },
      },
    }

    

  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') return grunt.task.run(['build', 'connect:dist:keepalive']);

    grunt.task.run([
      'clean:server',
      'assemble',
      'handlebars',
      'concurrent:',
      'autoprefixer',
      'copy:protoScripts',
      'copy:crossdomain',
      'copy:mdaSkin',
      'connect:livereload',
      'watch'
    ]);
  });

 

  grunt.registerTask('build', [
    'compass:core',
    'handlebars',
    'autoprefixer',
    'copy:scripts'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);


};

