package com.elane.shoppingapp;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "ElaneMainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Global crash guard to prevent background/plugin crashes from closing the app
        Thread.UncaughtExceptionHandler defaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((thread, throwable) -> {
            Log.e(TAG, "Uncaught exception on thread: " + (thread != null ? thread.getName() : "unknown"), throwable);
            if (throwable != null && throwable.getMessage() != null && throwable.getMessage().contains("FirebaseApp")) {
                Log.w(TAG, "Suppressed Firebase uninitialized crash to keep app alive");
                return;
            }
            if (defaultHandler != null) {
                defaultHandler.uncaughtException(thread, throwable);
            }
        });

        try {
            WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

            View content = findViewById(android.R.id.content);
            if (content != null) {
                ViewCompat.setOnApplyWindowInsetsListener(content, (view, windowInsets) -> {
                    Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.statusBars());
                    view.setPadding(0, insets.top, 0, 0);
                    return windowInsets;
                });
            }
        } catch (Throwable t) {
            Log.w(TAG, "WindowCompat insets setup error: " + t.getMessage());
        }
    }
}


