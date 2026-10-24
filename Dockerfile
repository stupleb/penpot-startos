ARG IMAGE

FROM --platform=$BUILDPLATFORM debian:trixie-slim AS store
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates p11-kit p11-kit-modules \
 && trust extract --format=java-cacerts --filter=ca-anchors --purpose=server-auth /cacerts \
 && rm -rf /var/lib/apt/lists/*

FROM debian:trixie-slim AS brotli
RUN apt-get update \
 && apt-get install -y --no-install-recommends libbrotli1 \
 && dpkg --compare-versions "$(dpkg-query -W -f '${Version}' libbrotli1)" ge 1.1.0-2+deb13u1 \
 && mkdir /brotli \
 && cp /usr/lib/*-linux-gnu/libbrotlicommon.so.1.1.0 /usr/lib/*-linux-gnu/libbrotlidec.so.1.1.0 /usr/lib/*-linux-gnu/libbrotlienc.so.1.1.0 /brotli/ \
 && rm -rf /var/lib/apt/lists/*

FROM ${IMAGE}
USER root
# Upstream's hardened base versions its packages above Debian's fixes, so apt can't upgrade them.
RUN rm -rf /etc/ssl/certs /usr/share/ca-certificates
COPY --from=store /etc/ssl/certs /etc/ssl/certs
COPY --from=store /usr/share/ca-certificates /usr/share/ca-certificates
COPY --from=store /etc/ca-certificates.conf /etc/ca-certificates.conf
COPY --from=store /cacerts /opt/jre/lib/security/cacerts
COPY --from=brotli /brotli /tmp/brotli
RUN lib="$(dirname "$(readlink -f /usr/lib/*-linux-gnu/libbrotlidec.so.1)")" \
 && for n in common dec enc; do \
      cp "/tmp/brotli/libbrotli$n.so.1.1.0" "$lib/libbrotli$n.so.1.1.0" \
      && cp "/tmp/brotli/libbrotli$n.so.1.1.0" "/opt/imagick/lib/deps/libbrotli$n.so.1" \
      && cmp "/tmp/brotli/libbrotli$n.so.1.1.0" "$(readlink -f "$lib/libbrotli$n.so.1")" \
      && cmp "/tmp/brotli/libbrotli$n.so.1.1.0" "/opt/imagick/lib/deps/libbrotli$n.so.1" \
      || exit 1; \
    done \
 && rm -rf /tmp/brotli
RUN ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && keytool -list -v -cacerts -storepass changeit > /tmp/cacerts.txt \
 && grep -q '^Owner: CN=ISRG Root X1,' /tmp/cacerts.txt \
 && ! grep -q '^Owner: CN=emSign ECC Root CA - G3,' /tmp/cacerts.txt \
 && rm /tmp/cacerts.txt \
 && cp "$(find /usr/share/fonts -name '*.ttf' | head -n 1)" /tmp/check.ttf \
 && woff2_compress /tmp/check.ttf \
 && rm /tmp/check.ttf \
 && woff2_decompress /tmp/check.woff2 \
 && test -s /tmp/check.ttf \
 && rm /tmp/check.woff2 /tmp/check.ttf
USER penpot:penpot
