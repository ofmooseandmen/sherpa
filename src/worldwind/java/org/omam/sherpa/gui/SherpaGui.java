package org.omam.sherpa.gui;

import gov.nasa.worldwind.Configuration;

import java.awt.Frame;
import java.lang.Thread.UncaughtExceptionHandler;

import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.UIManager.LookAndFeelInfo;

public final class SherpaGui {

    private static final String APP_NAME = "Sherpa GUI";

    private SherpaGui() {
        System.setProperty("java.net.useSystemProxies", "true");
        if (Configuration.isMacOS()) {
            System.setProperty("apple.laf.useScreenMenuBar", "true");
            System.setProperty("com.apple.mrj.application.apple.menu.about.name", "World Wind Application");
            System.setProperty("com.apple.mrj.application.growbox.intrudes", "false");
            System.setProperty("apple.awt.brushMetalLook", "true");
            System.setProperty("com.apple.mrj.application.apple.menu.about.name", APP_NAME);
        } else if (Configuration.isWindowsOS()) {
            /*
             * prevents flashing during window resizing
             */
            System.setProperty("sun.awt.noerasebackground", "true");
        }
    }

    private void start() {
        try {
            for (final LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
            final GuiFrame frame = new GuiFrame();
            frame.setTitle(APP_NAME);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setExtendedState(Frame.MAXIMIZED_BOTH);

            Thread.setDefaultUncaughtExceptionHandler(new UncaughtExceptionHandler() {

                @Override
                public final void uncaughtException(final Thread t, final Throwable e) {
                    final String cr = System.getProperty("line.separator");
                    final StackTraceElement[] ses = e.getStackTrace();
                    String msg = e.getCause() + ":" + e.getMessage() + cr;
                    for (final StackTraceElement se : ses) {
                        if (se.getClassName().contains("omam")) {
                            msg += se.toString();
                            msg += cr;
                        }
                    }
                    JOptionPane.showMessageDialog(frame, msg, "Error", JOptionPane.ERROR_MESSAGE);
                }
            });

            SwingUtilities.invokeLater(new Runnable() {
                @Override
                public final void run() {
                    frame.start();
                }
            });

        } catch (final Exception e) {
            e.printStackTrace();
        }
    }

    public static final void main(final String[] args) {
        final SherpaGui gui = new SherpaGui();
        gui.start();
    }

}
