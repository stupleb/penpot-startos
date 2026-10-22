ARG IMAGE

FROM --platform=$BUILDPLATFORM debian:trixie-slim AS store
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates p11-kit p11-kit-modules \
 && trust extract --format=java-cacerts --filter=ca-anchors --purpose=server-auth /cacerts \
 && rm -rf /var/lib/apt/lists/*

FROM ${IMAGE}
USER root
# Upstream's hardened base versions ca-certificates above Debian's fix, so apt can't upgrade it.
RUN rm -rf /etc/ssl/certs /usr/share/ca-certificates
COPY --from=store /etc/ssl/certs /etc/ssl/certs
COPY --from=store /usr/share/ca-certificates /usr/share/ca-certificates
COPY --from=store /etc/ca-certificates.conf /etc/ca-certificates.conf
COPY --from=store /cacerts /opt/jre/lib/security/cacerts
RUN ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt \
 && keytool -list -v -cacerts -storepass changeit > /tmp/cacerts.txt \
 && grep -q '^Owner: CN=ISRG Root X1,' /tmp/cacerts.txt \
 && ! grep -q '^Owner: CN=emSign ECC Root CA - G3,' /tmp/cacerts.txt \
 && rm /tmp/cacerts.txt
USER penpot:penpot
