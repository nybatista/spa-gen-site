  const path = require('path');
  const webpack = require('webpack');
  const env = require('yargs').argv.env; // use --env with webpack 2
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const {CleanWebpackPlugin} = require('clean-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const fs = require('fs');

  const miniCssPlugin = new MiniCssExtractPlugin({
    filename: 'assets/css/main.css'
  });

  const getEnvVals = (e) => {
    const isProd = e === 'build';
    const devMode =  env !== 'build';
    const mode = isProd ? 'production' : 'development';
    const map = isProd ? 'eval' : 'inline-cheap-source-map';
    const publicPath = isProd ? '' : '/';
    return {devMode, mode, map, publicPath};

  };

  const envVals = getEnvVals(env);



  const shell = require('child_process').execSync ;


  const copyDir = (srcDirectory, destDirectory)=>{
    const P = {
      src: path.resolve(__dirname, srcDirectory)
    };

    shell(`mkdir -p ${destDirectory}`);
    shell(`cp -r ${P.src}/* ${destDirectory}`);
  };

  const assetsFolder = "assets/";




  const extractSass = new ExtractTextPlugin({
    filename: 'assets/css/main.css',
    disable: envVals.devMode

  });

  const cleanPlugin = new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*', '!.gitkeep'],
    cleanAfterEveryBuildPatterns: ['!.gitkeep']
  });

  const htmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.tmpl.html'
  });

  const devMode = env!=='build';



  const PATHS = {
    dist: path.join(__dirname, 'dist'),
    src: path.join(__dirname, 'src')
  };


  const writeHtaccessToDist = ()=>{

    const onComplete = (err, data)=>{
      if(err){
        return console.log("ERROR IN HTACCESS SAVE ",{err})
      }else {
        console.log("htaccess copied");
      }
    }

    const htaccessText = `# html5 pushstate (history) support:
<ifModule mod_rewrite.c>
    RewriteEngine On

    # the final correct redirect
    RewriteEngine on
    RewriteCond %{HTTP:X-Forwarded-Proto} ^http$
    RewriteRule .* https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]


    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !index
    RewriteRule (.*) index.html [L,QSA]
</ifModule>


<IfModule mod_headers.c>
   Header add Access-Control-Allow-Origin: *
</IfModule>`;

    const fileName = `${PATHS.dist}/.htaccess`;
    fs.writeFile(fileName, htaccessText, onComplete);
  }

  const ProgressHookPlugin = new webpack.ProgressPlugin(function(percentage, msg) {
    if (percentage===0){
      // pre-hook code (before webpack compiles )
    } else if (percentage===1){
      console.log("PROCESS COMPLETED ");
      writeHtaccessToDist();
      // post-hook code (after webpack compiles )
     // copyDir('./src/static/fonts/', './dist/'+ assetsFolder+'/static/fonts/');
    //  copyDir('./src/static/imgs/', './dist/'+ assetsFolder+'/static/imgs/');

    }
  });



  const config = {
    mode: envVals.mode,

    entry: {
      index: './src/index.js'
    },

    output: {
      filename: 'assets/js/[name].js',
      path: PATHS.dist,
      publicPath: envVals.publicPath,
    },

    devtool: envVals.map,

    devServer: {
      contentBase: PATHS.src,
      historyApiFallback: true,
      port: 8080
    },

    plugins: [miniCssPlugin, cleanPlugin, htmlPlugin,ProgressHookPlugin],

    optimization: {
      splitChunks: {
        cacheGroups: {
          common: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: 'all',
          }
        },
      }
    },

    module: {
      rules: [

        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../'
              }
            } ,
              "css-loader"

          ]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
/*              attributes: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                  },
                  {
                    tag: 'img',
                    attribute: 'srcset',
                    type: 'srcset',
                  },
                  {
                    tag: 'img',
                    attribute: 'data-src',
                    type: 'src',
                  },
                  {
                    tag: 'img',
                    attribute: 'data-srcset',
                    type: 'srcset',
                  }

                ]

              },*/
              minimize: false,
              esModule: false
            }
          }
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
              envVals.devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name(file) {
                  let dir = String(file).includes('/imgs/') === true ? 'static/imgs/' : '/static/data/';
                  if (devMode===false){
                    dir = assetsFolder+""+dir;
                  }

                  return dir + '[name].[ext]';
                },
              },
            }],

        },
        {
          type: 'javascript/auto',
          test: /\.(json|vtt)$/,
          use: [    {
            loader: 'file-loader',
            options: {
              name(file) {
                let dir = devMode === false ? assetsFolder+"static/data/" : "./static/data/";
                return dir + '[name].[ext]';
              },
            },
          } ]
        }
      ]
    },

    resolve: {
      alias: {
        plugins: path.resolve(__dirname, 'src/plugins/'),
        imgs: path.resolve(__dirname, 'src/static/imgs/'),
        fonts: path.resolve(__dirname, 'src/static/fonts/'),
        data: path.resolve(__dirname, 'src/static/data/'),
        css: path.resolve(__dirname, 'src/css/'),
        core: path.resolve(__dirname, 'src/core/'),
        traits: path.resolve(__dirname, 'src/app/traits/'),
        channels: path.resolve(__dirname, 'src/app/channels/'),
        main_components: path.resolve(__dirname, 'src/app/components/'),
        components: path.resolve(__dirname, 'src/base-app/src/app/components/'),
        node_modules: path.resolve(__dirname, 'node_modules/')

      },
      extensions: ['.js', '.css'],
    }

  };



module.exports = config;
