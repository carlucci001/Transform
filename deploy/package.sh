#!/bin/bash

# ChatWidget Pro - Deployment Package Creator
# This script creates a deployment package for LAMP environments

echo "Creating deployment package for ChatWidget Pro..."

# Create deploy directory if it doesn't exist
mkdir -p deploy/package

# Build the project
echo "Building production files..."
npm run build

# Copy build files
echo "Copying build files..."
cp -r dist deploy/package/

# Copy installation files
cp deploy/install-instructions.md deploy/package/
cp deploy/embed-script.html deploy/package/
cp deploy/.htaccess deploy/package/

# Create a simple index.php for testing
cat > deploy/package/index.php << 'EOF'
<?php
// ChatWidget Pro - Test Page
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatWidget Pro - Installation Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h1>ChatWidget Pro - Installation Test</h1>
    
    <?php
    $distExists = is_dir('dist');
    $assetsExists = is_dir('dist/assets');
    $indexExists = file_exists('dist/index.html');
    ?>
    
    <h2>Installation Status:</h2>
    <ul>
        <li>Dist folder: <span class="<?php echo $distExists ? 'success' : 'error'; ?>">
            <?php echo $distExists ? '✓ Found' : '✗ Not Found'; ?>
        </span></li>
        <li>Assets folder: <span class="<?php echo $assetsExists ? 'success' : 'error'; ?>">
            <?php echo $assetsExists ? '✓ Found' : '✗ Not Found'; ?>
        </span></li>
        <li>Index.html: <span class="<?php echo $indexExists ? 'success' : 'error'; ?>">
            <?php echo $indexExists ? '✓ Found' : '✗ Not Found'; ?>
        </span></li>
    </ul>
    
    <?php if ($distExists && $assetsExists && $indexExists): ?>
        <p class="success">✓ Installation successful! The widget is ready to use.</p>
        <p><a href="dist/index.html" target="_blank">View Demo Page</a></p>
        
        <h2>Embed Code:</h2>
        <pre><?php 
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]" . dirname($_SERVER['REQUEST_URI']);
        echo htmlspecialchars("<!-- ChatWidget Pro -->
<script>
  (function() {
    window.ChatWidgetConfig = {
      baseUrl: '$baseUrl',
      position: 'bottom-right',
      primaryColor: '#3B82F6',
      makeWebhookUrl: 'YOUR_WEBHOOK_URL',
      agentName: 'Support Agent'
    };
    
    // Widget loader code here...
  })();
</script>"); 
        ?></pre>
    <?php else: ?>
        <p class="error">✗ Installation incomplete. Please check the files and permissions.</p>
    <?php endif; ?>
</body>
</html>
EOF

# Create .htaccess for Apache
cat > deploy/package/.htaccess << 'EOF'
# ChatWidget Pro - Apache Configuration

# Prevent directory listing
Options -Indexes

# Enable CORS for widget embedding
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>

# Serve the correct MIME types
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType text/css .css
    AddType image/svg+xml .svg
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript application/json
</IfModule>

# Cache control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>
EOF

# Create deployment archive
echo "Creating deployment archive..."
cd deploy/package
zip -r ../chatwidget-pro-deploy.zip .
cd ../..

echo "✓ Deployment package created successfully!"
echo ""
echo "Package location: deploy/chatwidget-pro-deploy.zip"
echo ""
echo "Next steps:"
echo "1. Upload chatwidget-pro-deploy.zip to your LAMP server"
echo "2. Extract the files to your web directory"
echo "3. Follow the instructions in install-instructions.md"
echo "4. Test the installation by visiting index.php"
